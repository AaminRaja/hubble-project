# Hubble — Cavliwireless Web Developer Task

A landing page for Hubble (Cavliwireless's product) and a scraper that populates
its exhibitor data, sharing one Postgres database.

## Demo

- **Live app:** _add hosted URL here_
- **Trigger the scraper on the live app:**
```bash
  curl -X POST https://your-app.vercel.app/api/scrape/exhibitors
```

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma ORM
- Docker Compose (local Postgres)

## Project setup (local)

**Requirements:** Node.js 18+, Docker Desktop.

1. Install dependencies:
```bash
   npm install
```

2. Start Postgres:
```bash
   docker compose up -d
```

3. Create `.env` in the project root:
```
   DATABASE_URL="postgresql://hubble:hubble_dev_password@localhost:5433/hubble_db?schema=public"
```
   > Note: the container maps to host port **5433**, not 5432, to avoid clashing
   > with a local Postgres install. See `docker-compose.yml`.

4. Create the database tables:
```bash
   npx prisma migrate dev
```

5. Populate exhibitor data (see [Triggering the scraper](#triggering-the-scraper) below).

6. Run the app:
```bash
   npm run dev
```
   Open http://localhost:3000.

## Database design

Five tables, designed from the shape of the source API
(`mmiconnect.in/graphql`, `getExhibitorListForGroup` query).

### `shows`
| Column | Type | Notes |
|---|---|---|
| id | Int (PK) | Same ID as the source API's `showId` |
| show_name | String | |
| start_date | DateTime | |
| end_date | DateTime | |

One event group (`ep-blr-2026`) spans multiple shows happening at the same
venue. Multiple exhibitors share a show, so show details live here once
instead of repeating on every exhibitor row.

### `exhibitors`
| Column | Type | Notes |
|---|---|---|
| id | Int (PK) | Same ID as the source API's customer `id` |
| company_name | String | |
| country | String, nullable | |
| square_logo | String, nullable | |
| user_id | String | |
| show_id | Int (FK → shows.id) | |
| exhibitor_type | String, nullable | |
| sponsorship | String, nullable | |
| booth_no | String, nullable | |
| hall_no | String, nullable | |

Booth/hall/type fields stay on this table rather than a separate one because
they are a true 1:1 relationship with the exhibitor (never repeating) — splitting
a 1:1 into two tables would add a join with no normalization benefit.

### `categories`
| Column | Type | Notes |
|---|---|---|
| id | Int (PK) | Same ID as the source API's category `id` |
| main_category | String | e.g. "Semiconductors" |
| category_type | String | |
| product_category_type | String | |

Category names are shared across many exhibitors (one category can have
hundreds), so they're stored once and referenced by ID rather than repeated
as text on every exhibitor row.

### `exhibitor_categories` (join table)
| Column | Type | Notes |
|---|---|---|
| exhibitor_id | Int (FK → exhibitors.id) | |
| category_id | Int (FK → categories.id) | |

Composite primary key on both columns. Confirmed via the API (filtering
exhibitors by `categoryIds` returns a smaller, non-trivial subset — e.g. 248
of 814 for one category) that exhibitors and categories are genuinely
many-to-many: one exhibitor can appear under several categories. A join
table is the only 3NF-compliant way to represent that without repeating
groups in either table.

> Populating this table requires one API request per category (384 categories
> in the current dataset) and is **not run by default**, since it isn't used
> by the UI and isn't required by the brief. Trigger it explicitly with
> `?withLinks=true` (see below) if you want it populated — the schema and
> relationship are real either way.

### `consult_submissions`
| Column | Type | Notes |
|---|---|---|
| id | Int (PK, autoincrement) | No natural ID from any external source |
| name | String | required |
| email | String | required, validated server-side |
| phone | String, nullable | |
| company | String, nullable | optional per brief |
| message | Text | required |
| created_at | DateTime | defaults to now |

Independent of the exhibitor data — just where "Consult Now" submissions land.

### Why this satisfies 3NF

- No column stores a value derivable from another column in the same row.
- No repeating text (show names, category names) is duplicated across rows —
  each is stored once and referenced by foreign key.
- The one genuine many-to-many relationship (exhibitors ↔ categories) has its
  own join table instead of being flattened into a list or comma-separated field.

## Triggering the scraper

Source: `https://mmiconnect.in/graphql` (public GraphQL API discovered via
network inspection — the exhibitor catalogue page is a client-rendered SPA
with no data in its initial HTML).

**Default (fast — exhibitors and shows only, ~1 minute):**
```bash
curl -X POST http://localhost:3000/api/scrape/exhibitors
```

**Full (also populates the category↔exhibitor join table, ~20+ minutes —
384 extra API calls, one per category):**
```bash
curl -X POST "http://localhost:3000/api/scrape/exhibitors?withLinks=true"
```

**Pagination:** the API's `after` parameter is a confirmed offset
(`-1 → 99 → 199 → ...`), verified with no overlap or gaps between pages.

**Upsert / no duplicates on re-run:** every row uses the source API's own ID
as its primary key, so re-running the scraper updates existing rows via
`upsert` rather than inserting duplicates. Verified by running the scraper
twice and confirming identical row counts both times.

## What's not handled

- Exhibitors removed from the source site are not deleted locally on re-run
  (upsert only adds/updates, by design — safer than deleting based on one
  API response).
- The category-linking join table isn't populated by the default scrape (see
  above).