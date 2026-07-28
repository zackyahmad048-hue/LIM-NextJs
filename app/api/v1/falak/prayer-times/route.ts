import { NextRequest, NextResponse } from "next/server";
import { prayerTimeQuerySchema } from "@/modules/falak/validations/schema";
import { falakService } from "@/modules/falak/application/service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = prayerTimeQuerySchema.safeParse({
      latitude: searchParams.get("latitude"),
      longitude: searchParams.get("longitude"),
      date: searchParams.get("date") || undefined,
      method: searchParams.get("method") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Parameter tidak valid.", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { latitude, longitude, date, method } = parsed.data;
    const targetDate = date || new Date();

    const result = await falakService.getPrayerTimes(
      { latitude, longitude },
      targetDate,
      method
    );

    return NextResponse.json({ success: true, message: "Success", data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
