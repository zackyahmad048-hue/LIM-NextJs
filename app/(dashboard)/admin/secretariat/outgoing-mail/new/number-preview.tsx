"use client";

const ROMAN_MONTHS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export function NumberPreview({
  levelCode,
  categoryCode,
  mailDate,
}: {
  levelCode: string;
  categoryCode: string;
  mailDate: string;
}) {
  const date = mailDate ? new Date(mailDate) : null;
  const segments = [
    "—",
    levelCode || "—",
    categoryCode || "—",
    date ? ROMAN_MONTHS[date.getMonth()] : "—",
    date ? String(date.getFullYear()) : "—",
  ];

  return (
    <div className="flex items-center justify-between gap-3">
      <div
        className="inline-flex items-stretch overflow-hidden rounded-lg border bg-[#FAFAFA] dark:bg-[#1F1F1F]"
        aria-label="Pratinjau nomor surat"
      >
        {segments.map((segment, index) => (
          <span
            key={`${segment}-${index}`}
            className={`px-2.5 py-1.5 text-sm font-semibold tabular-nums tracking-tight ${
              index > 0 ? "border-l border-border" : ""
            } ${segment === "—" ? "text-muted-foreground" : "text-foreground"}`}
          >
            {segment}
          </span>
        ))}
      </div>
      <p className="hidden text-xs text-muted-foreground sm:block">
        Nomor terbit otomatis saat ditandai terkirim
      </p>
    </div>
  );
}
