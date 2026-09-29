import { NextResponse } from "next/server";
import { isSyncRunning, syncExhibitors } from "../../../../lib/scraper/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (isSyncRunning()) {
    return NextResponse.json(
      { success: false, error: "A scrape is already running" },
      { status: 409 },
    );
  }

  const populateCategoryLinks =
    new URL(request.url).searchParams.get("withLinks") === "true";

  try {
    const result = await syncExhibitors({ populateCategoryLinks });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Exhibitor scrape failed:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
