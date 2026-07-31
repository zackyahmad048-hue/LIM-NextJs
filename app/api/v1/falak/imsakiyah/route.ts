import { NextRequest, NextResponse } from "next/server";
import { imsakiyahQuerySchema } from "@/modules/falak/validations/schema";
import { falakService } from "@/modules/falak/application/service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = imsakiyahQuerySchema.safeParse({
      year: searchParams.get("year") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Parameter tidak valid.", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { year } = parsed.data;
    const data = year ? await falakService.getImsakiyahByYear(year) : await falakService.getImsakiyah();

    return NextResponse.json({ success: true, message: "Success", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
