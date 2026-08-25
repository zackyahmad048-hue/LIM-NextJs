/**
 * Latar hero ringan - dekorasi CSS murni (glow oranye + pola titik).
 * Pengganti LiquidEther/WebGL: tanpa JS, tanpa gambar, tanpa beban GPU.
 */
export default function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -top-40 right-[-8%] h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-[110px]" />
      <div className="absolute top-48 left-[-10%] h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_65%)]" />
    </div>
  );
}
