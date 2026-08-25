import { cn } from "@/lib/utils";

function splitNumber(fullNumber: string): string[] {
  return fullNumber.split("/");
}

interface LetterPlateProps {
  fullNumber: string;
  size?: "md" | "sm";
  className?: string;
}

/**
 * Plat nomor surat resmi — nomor lima segmen dengan pemisah garis rambut,
 * ciri khas area Sekretariat. Segmen adalah data nyata dari aturan
 * penomoran organisasi (urutan/tingkat/kategori/bulan/tahun).
 */
export function LetterPlate({
  fullNumber,
  size = "md",
  className,
}: LetterPlateProps) {
  const segments = splitNumber(fullNumber);

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-lg border bg-muted",
        size === "md" ? "border-border/80" : "border-border/60",
        className,
      )}
      aria-label={`Nomor surat ${fullNumber}`}
    >
      {segments.map((segment, index) => (
        <span
          key={`${segment}-${index}`}
          className={cn(
            "flex items-center px-2.5 font-semibold tabular-nums text-foreground",
            size === "md" ? "py-2 text-xl md:text-2xl" : "py-1 text-sm",
            index > 0 ? "border-l border-border" : "",
          )}
        >
          {segment}
        </span>
      ))}
    </div>
  );
}
