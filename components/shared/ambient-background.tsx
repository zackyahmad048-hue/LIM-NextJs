/*
 * Ambient observatorium — lapisan warna lembut + grid hairline di belakang
 * konten sehingga permukaan kaca (`--glass-*`) punya sesuatu untuk diburamkan.
 * Pure CSS (tanpa WebGL), `position: fixed`, ditaruh paling belakang di dalam
 * stacking context `.site`/`.admin`. Reduksi gerak ditangani global:
 * @media prefers-reduced-motion mematikan animasi orb.
 */
export default function AmbientBackground() {
  return (
    <div aria-hidden className="ambient">
      <div className="ambient-orb ambient-orb--a" />
      <div className="ambient-orb ambient-orb--b" />
      <div className="ambient-orb ambient-orb--c" />
      <div className="ambient-grid" />
    </div>
  );
}