import type { Metadata } from "next";
import { Moon } from "lucide-react";
import { falakService } from "@/modules/falak/application/service";

export const metadata: Metadata = {
  title: "Jadwal Imsakiyah | Falak | LIM Digital Platform",
  description: "Jadwal imsakiyah Ramadan beserta waktu shalat, fase bulan, dan hisab tinggi hilal.",
};

const TIME_COLUMNS = [
  { key: "imsak", label: "Imsak" },
  { key: "subuh", label: "Subuh" },
  { key: "terbit", label: "Terbit" },
  { key: "dhuha", label: "Dhuha" },
  { key: "dzuhur", label: "Dzuhur" },
  { key: "ashar", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isya", label: "Isya" },
] as const;

type ImsakiyahRow = Awaited<ReturnType<typeof falakService.getImsakiyah>>[number];

function TimeCell({ value }: { value: string }) {
  return <span className="font-mono text-sm text-foreground">{value}</span>;
}

export default async function ImsakiyahPage() {
  const items = await falakService.getImsakiyah();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-foreground">
          <Moon className="h-7 w-7 text-primary" />
          Jadwal Imsakiyah
        </h1>
        <p className="mt-2 text-muted-foreground">
          Jadwal imsakiyah Ramadan lengkap dengan waktu shalat, fase bulan, dan hisab tinggi hilal.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Belum ada data imsakiyah.
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full border border-border bg-card px-3 py-1">
              {items[0].city}, {items[0].province}
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1">
              {items[0].hijriMonth} {items[0].hijriYear}
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1">
              {items.length} hari
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Ramadan Ke</th>
                  <th className="px-3 py-3 font-medium">Tanggal</th>
                  <th className="px-3 py-3 font-medium">Hijriah</th>
                  {TIME_COLUMNS.map((col) => (
                    <th key={col.key} className="px-3 py-3 text-center font-medium">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-3 py-3 font-medium">Fase Bulan</th>
                  <th className="px-3 py-3 font-medium">Tinggi Hilal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: ImsakiyahRow) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/60 last:border-b-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-3 py-2.5 font-semibold text-primary">{item.ramadanDay}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-medium text-foreground">
                        {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(item.gregorianDate)}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        {item.dayName} {item.javaneseDay}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {item.hijriDate} {item.hijriMonth} {item.hijriYear}
                    </td>
                    {TIME_COLUMNS.map((col) => (
                      <td key={col.key} className="px-3 py-2.5 text-center">
                        <TimeCell value={item[col.key]} />
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{item.moonPhase ?? "-"}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{item.hilalAltitude ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
