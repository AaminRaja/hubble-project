import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { validateConsult } from "../../../lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const result = validateConsult(body);
  if (!result.valid || !result.data) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 },
    );
  }

  try {
    const submission = await prisma.consultSubmission.create({
      data: result.data,
    });
    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("Failed to save consult submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Could not save your message. Please try again.",
      },
      { status: 500 },
    );
  }
}
