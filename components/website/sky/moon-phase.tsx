interface MoonPhaseProps {
  phase: number;
  className?: string;
}

function moonPath(phase: number): string {
  const r = 44;
  const c = 50;
  const t = phase * 2 * Math.PI;
  const rx = r * Math.abs(Math.sin(t));
  const dx = r * Math.cos(t);
  const waxing = t < Math.PI;
  const sweepOuter = waxing ? 1 : 0;
  const sweepTerm = waxing ? 0 : 1;
  const h = c + dx;

  return [
    `M ${h} ${c - r}`,
    `A ${r} ${r} 0 0 ${sweepOuter} ${h} ${c + r}`,
    `A ${rx} ${r} 0 0 ${sweepTerm} ${h} ${c - r} Z`,
  ].join(" ");
}

export function MoonPhase({ phase, className }: MoonPhaseProps) {
  const illum = Math.round(
    ((1 - Math.cos(phase * 2 * Math.PI)) / 2) * 100,
  );

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={`Fase bulan, ${illum} persen terang`}
    >
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />
      <path d={moonPath(phase)} fill="currentColor" />
    </svg>
  );
}
