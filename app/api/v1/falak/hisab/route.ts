import { NextRequest, NextResponse } from "next/server";
import { falakService } from "@/modules/falak/application/service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;

    const result = await falakService.getHisabPaginated(page, limit, search);

    return NextResponse.json({ success: true, message: "Success", data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
