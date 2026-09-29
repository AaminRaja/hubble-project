import { NextResponse } from "next/server";
import { syncExhibitorPage } from "../../../../lib/scraper/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const after = Number(new URL(request.url).searchParams.get("after") ?? "-1");

  try {
    const result = await syncExhibitorPage(after);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Exhibitor scrape page failed:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}