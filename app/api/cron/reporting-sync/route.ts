import { NextRequest, NextResponse } from "next/server";

import { syncReporting } from "@/modules/reporting/application/reporting.service";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}

async function handle(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const header =
      request.headers.get("authorization") ??
      request.headers.get("x-cron-secret") ??
      "";
    const querySecret = new URL(request.url).searchParams.get("secret") ?? "";
    const supplied = header.replace(/^Bearer\s+/i, "") || querySecret;
    if (supplied !== expected) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }
  }

  try {
    const result = await syncReporting();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
