import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { fetchExhibitorPage, sleep, PAGE_SIZE } from "./client";
import { ApiCategory, ApiCustomer, ApiShow } from "./types";

const DELAY_MS = 250;
const MAX_PAGES = 50;
const BATCH_SIZE = 100;

export interface SyncResult {
  exhibitors: number;
  shows: number;
  categories: number;
  links: number;
  skipped: number;
  durationMs: number;
}

let running = false;
export const isSyncRunning = (): boolean => running;

// The API sends dates like "2026-09-16T00:00:00" with no timezone.
// Treat those as UTC so the result doesn't depend on the server's timezone.
function parseApiDate(value: string): Date {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(value);
  return new Date(hasZone ? value : `${value}Z`);
}

async function runInBatches(
  ops: Prisma.PrismaPromise<unknown>[],
): Promise<void> {
  for (let i = 0; i < ops.length; i += BATCH_SIZE) {
    await prisma.$transaction(ops.slice(i, i + BATCH_SIZE));
  }
}

async function fetchAllPages(categoryIds?: number[]): Promise<{
  customers: ApiCustomer[];
  categories: ApiCategory[];
}> {
  const byId = new Map<number, ApiCustomer>();
  let categories: ApiCategory[] = [];
  let after = -1;

  for (let page = 0; page < MAX_PAGES; page++) {
    const result = await fetchExhibitorPage(after, categoryIds);
    if (page === 0) categories = result.categories;
    for (const customer of result.customers) byId.set(customer.id, customer);

    if (result.customers.length === 0) break;
    after += result.customers.length; // -1 -> 99 -> 199 ...
    if (result.customers.length < PAGE_SIZE || after + 1 >= result.totalCount)
      break;
    await sleep(DELAY_MS);
  }

  return { customers: [...byId.values()], categories };
}

export interface SyncOptions {
  populateCategoryLinks?: boolean;
}

export async function syncExhibitors(
  options: SyncOptions = {},
): Promise<SyncResult> {
  const { populateCategoryLinks = false } = options;
  if (running) throw new Error("A sync is already running");
  running = true;
  const started = Date.now();

  try {
    // 1. Fetch everything from the API first, before touching the database
    const { customers, categories } = await fetchAllPages();

    const shows = new Map<number, ApiShow>();
    const valid: ApiCustomer[] = [];
    for (const customer of customers) {
      if (!customer.show) continue; // can't satisfy the shows foreign key
      shows.set(customer.showId, customer.show);
      valid.push(customer);
    }

    // 2. Parents first: shows and categories
    await runInBatches(
      [...shows].map(([id, show]) => {
        const data = {
          showName: show.showName,
          startDate: parseApiDate(show.startDate),
          endDate: parseApiDate(show.endDate),
        };
        return prisma.show.upsert({
          where: { id },
          update: data,
          create: { id, ...data },
        });
      }),
    );

    await runInBatches(
      categories.map((category) => {
        const data = {
          mainCategory: category.mainCategory,
          categoryType: category.categoryType,
          productCategoryType: category.productCategoryType,
        };
        return prisma.category.upsert({
          where: { id: category.id },
          update: data,
          create: { id: category.id, ...data },
        });
      }),
    );

    // 3. Exhibitors (they reference shows)
    await runInBatches(
      valid.map((c) => {
        const data = {
          companyName: c.companyName.trim(),
          country: c.country,
          squareLogo: c.squareLogo,
          userId: c.userId,
          showId: c.showId,
          exhibitorType: c.exhibitorDetail?.exhibitorType ?? null,
          sponsorship: c.exhibitorDetail?.sponsorship ?? null,
          boothNo: c.exhibitorDetail?.boothNo ?? null,
          hallNo: c.exhibitorDetail?.hallNo ?? null,
        };
        return prisma.exhibitor.upsert({
          where: { id: c.id },
          update: data,
          create: { id: c.id, ...data },
        });
      }),
    );

    // 4. Links: one filtered fetch per category (slow — 384 extra API calls).
    // Off by default; the join table exists to model the real many-to-many
    // relationship, but populating it isn't required by the brief and isn't
    // used by the UI. Pass { populateCategoryLinks: true } to run it.
    let links = 0;
    if (populateCategoryLinks) {
      const knownIds = new Set(valid.map((c) => c.id));
      for (const category of categories) {
        const { customers: inCategory } = await fetchAllPages([category.id]);
        const exhibitorIds = inCategory
          .map((c) => c.id)
          .filter((id) => knownIds.has(id));

        await prisma.$transaction([
          prisma.exhibitorCategory.deleteMany({
            where: { categoryId: category.id },
          }),
          prisma.exhibitorCategory.createMany({
            data: exhibitorIds.map((exhibitorId) => ({
              exhibitorId,
              categoryId: category.id,
            })),
            skipDuplicates: true,
          }),
        ]);
        links += exhibitorIds.length;
        await sleep(DELAY_MS);
      }
    }

    return {
      exhibitors: valid.length,
      shows: shows.size,
      categories: categories.length,
      links,
      skipped: customers.length - valid.length,
      durationMs: Date.now() - started,
    };
  } finally {
    running = false;
  }
}
