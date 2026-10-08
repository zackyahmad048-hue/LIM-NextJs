/**
 * Loop A — integrity guard untuk regresi navigation-motion / admin-dashboard.
 *
 * Cek statis deterministik (<1s, tanpa server, tanpa DB, tanpa jsdom) atas
 * ke-9 defek yang sudah diverifikasi pada sesi diagnosis:
 *
 *   R1 palette-terkunci-mobile   navbar hanya merender pencarian saat Sheet mobile terbuka
 *   R2 remount-per-rute          AnimatePresence mode="wait" + key={pathname} pada chrome utama
 *   R3 layoutId-kembar           literal layoutId sama dipakai >1 file dalam satu pohon render
 *   R4 tbody-tak-saing           elemen non-tr (div/motion.div) sebagai anak <tbody>
 *   R5 delete-tanpa-aksi         handler hapus hanya confirm() + TODO
 *   R6 rute-mati                 href / router.push yang tidak punya file page
 *   R7 render-tak-deterministik  Math.random() di dalam komponen (memicu hydration mismatch)
 *   R8 responsive-container-kembar  <ResponsiveContainer> di dalam <ChartContainer>
 *   R9 dialog-terkondisi         {open && <CommandDialog ...> } membuat exit variant tak berguna
 *
 * Jalankan: node scripts/check-ui-regressions.mjs
 * Keluar 0 bila hijau, 1 bila ada pelanggaran.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** @type {{ id: string, file: string, detail: string }[]} */
const violations = [];
const report = (id, file, detail) => violations.push({ id, file, detail });

const walk = (dir, ext = /\.(tsx?|mjs|js)$/) => {
  /** @type {string[]} */
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const entry of readdirSync(cur)) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      const full = path.join(cur, entry);
      const st = statSync(full);
      if (st.isDirectory()) stack.push(full);
      else if (ext.test(entry)) out.push(full);
    }
  }
  return out;
};

const rel = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
const read = (file) => readFileSync(file, "utf8");

const sourceFiles = walk(path.join(ROOT, "components"));
const tsxFiles = sourceFiles.filter((f) => /\.tsx$/.test(f));

// ─── R1 palette terkunci di balik state Sheet mobile ────────────────────────
{
  const file = "components/website/layout/navbar.tsx";
  const src = read(path.join(ROOT, file));
  if (/\{\s*open\s*&&[\s\S]{0,800}?<GlobalSearchPalette/.test(src)) {
    report(
      "R1 palette-terkunci-mobile",
      file,
      "GlobalSearchPalette dirender di dalam blok `{open && ...}` — `open` adalah state Sheet " +
        "hanya `lg:hidden`, jadi palet pencarian tak pernah muncul di desktop.",
    );
  }
}

// ─── R2 chrome utama di-remount setiap pindah rute ─────────────────────────
{
  const file = "components/website/layout/navbar.tsx";
  const src = read(path.join(ROOT, file));
  if (/mode="wait"[\s\S]{0,600}key=\{pathname\}/.test(src)) {
    report(
      "R2 remount-per-rute",
      file,
      'AnimatePresence mode="wait" membungkus seluruh chrome dengan key={pathname} — seluruh ' +
        "header (logo, nav, aksi) di-unmount/remount di tiap navigasi.",
    );
  }
}

// ─── R3 literal layoutId kembar lintas file ────────────────────────────────
{
  /** @type {Map<string, Set<string>>} */
  const byId = new Map();
  for (const file of tsxFiles) {
    const src = read(file);
    for (const m of src.matchAll(/layoutId=\s*\{?[^}"\n]*"([^"]+)"/g)) {
      if (!byId.has(m[1])) byId.set(m[1], new Set());
      byId.get(m[1]).add(rel(file));
    }
  }
  for (const [id, files] of byId) {
    if (files.size > 1) {
      report(
        "R3 layoutId-kembar",
        [...files].sort().join(", "),
        `layoutId "${id}" dipakai di ${files.size} file berbeda — SharedLayoutAnimation memasangkan ` +
          "elemen lintas file, pill aktif jadi melayang/mencolok.",
      );
    }
  }
}

// ─── R4 elemen non-<tr> sebagai anak <tbody> ───────────────────────────────
{
  // Anak sah <tbody>: baris (tr/motion.tr), sel (td/th), dan pembungkus yang
  // tidak menghasilkan node DOM (Fragment/AnimatePresence) — depth sengaja
  // dihitung sebagai depth DOM agar keturunan <td> tidak ikut dituduh.
  const ALLOWED = new Set([
    "tr",
    "motion.tr",
    "td",
    "th",
    "template",
    "Fragment",
    "React.Fragment",
    "AnimatePresence",
  ]);
  const NO_DOM = new Set(["Fragment", "React.Fragment", "AnimatePresence"]);
  for (const file of tsxFiles) {
    const src = read(file);
    let from = 0;
    for (;;) {
      const open = src.indexOf("<tbody", from);
      if (open === -1) break;
      const close = src.indexOf("</tbody>", open);
      if (close === -1) break;
      // mulai setelah tag pembuka sendiri agar <tbody> tidak menandai dirinya
      const region = src.slice(open + 6, close);
      const line = src.slice(0, open).split("\n").length;
      const bad = new Set();
      let depth = 0;
      for (const m of region.matchAll(/<(\/?)([A-Za-z][\w.]*)([^>]*?)(\/?)>/g)) {
        const [, closing, name, , selfClose] = m;
        const invisible = NO_DOM.has(name);
        if (closing) {
          if (!invisible) depth = Math.max(0, depth - 1);
        } else {
          if (depth === 0 && !ALLOWED.has(name)) bad.add(name);
          if (!invisible && !selfClose) depth += 1;
        }
      }
      if (bad.size) {
        report(
          "R4 tbody-tak-saing",
          `${rel(file)}:${line}`,
          `<tbody> berisi ${[...bad].join(", ")} — React melempar validateDOMNesting dan merender ` +
            "markup tabel rusak (baris tak terbaca/screen reader kacau).",
        );
      }
      from = close + 1;
    }
  }
}

// ─── R5 handler hapus tanpa mutasi ─────────────────────────────────────────
for (const file of tsxFiles) {
  const src = read(file);
  const idx = src.search(/TODO:\s*Implement delete/i);
  if (idx !== -1) {
    report(
      "R5 delete-tanpa-aksi",
      `${rel(file)}:${src.slice(0, idx).split("\n").length}`,
      "konfirmasi dijalankan lalu kode berhenti pada TODO — tombol hapus tidak melakukan apa pun.",
    );
  }
}

// ─── R6 href / router.push yang tidak punya file page ──────────────────────
{
  const routeFiles = walk(path.join(ROOT, "app"), /page\.tsx$/);
  const routes = new Set();
  for (const f of routeFiles) {
    const r = rel(f)
      .replace(/^app\//, "/")
      .replace(/\/page\.tsx$/, "")
      .replace(/\/[^/]*\([^)]*\)/g, ""); // buang route group (dashboard)/(auth)/...
    routes.add(r === "" ? "/" : r);
  }
  const hasRoute = (target) => {
    const clean = target.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (routes.has(clean)) return true;
    const segs = clean.split("/").filter(Boolean);
    return [...routes].some((r) => {
      const rs = r.split("/").filter(Boolean);
      if (rs.length !== segs.length) return false;
      return rs.every((s, i) => s.startsWith("[") || s === segs[i]);
    });
  };

  const targets = new Map(); // target -> Set(file)
  for (const file of [...tsxFiles, ...walk(path.join(ROOT, "components"))]) {
    const src = read(file);
    for (const m of src.matchAll(/(?:\bhref=|router\.push\()\s*"([^"]+)"/g)) {
      const t = m[1];
      if (/^(https?:|mailto:|tel:|#|\/api\/)/.test(t)) continue;
      if (!targets.has(t)) targets.set(t, new Set());
      targets.get(t).add(rel(file));
    }
  }
  for (const [target, files] of [...targets].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!hasRoute(target)) {
      report(
        "R6 rute-mati",
        [...files].sort().join(", "),
        `tautan "${target}" tidak menunjuk ke file page mana pun — user diarahkan ke 404.`,
      );
    }
  }
}

// ─── R7 nilai acak saat render ─────────────────────────────────────────────
for (const file of tsxFiles) {
  const src = read(file);
  const idx = src.search(/Math\.random\(/);
  if (idx !== -1) {
    report(
      "R7 render-tak-deterministik",
      `${rel(file)}:${src.slice(0, idx).split("\n").length}`,
      "Math.random() dievaluasi saat render — server dan client menghasilkan nilai berbeda " +
        "(hydration mismatch di console).",
    );
  }
}

// ─── R8 ResponsiveContainer bersarang ──────────────────────────────────────
for (const file of tsxFiles) {
  const src = read(file);
  if (/<ChartContainer[\s\S]*?<ResponsiveContainer/.test(src)) {
    report(
      "R8 responsive-container-kembar",
      rel(file),
      "<ResponsiveContainer> membungkus <ChartContainer> (chart.tsx sudah merendernya sendiri) — " +
        "recharts memperingati layout 0×0.",
    );
  }
}

// ─── R9 CommandDialog dikondisikan di dalam AnimatePresence ────────────────
for (const file of tsxFiles) {
  const src = read(file);
  const idx = src.search(/\{\s*open\s*&&[\s\S]{0,300}?<CommandDialog/);
  if (idx !== -1) {
    report(
      "R9 dialog-terkondisi",
      `${rel(file)}:${src.slice(0, idx).split("\n").length}`,
      "{open && <CommandDialog open={open}>} — child dilepas dari AnimatePresence saat tutup, " +
        "sehingga variant exit tidak pernah berjalan.",
    );
  }
}

// ─── output ────────────────────────────────────────────────────────────────
if (violations.length === 0) {
  console.log("check-ui-regressions: OK (0 pelanggaran)");
  process.exit(0);
}

console.error(`check-ui-regressions: ${violations.length} pelanggaran\n`);
for (const v of violations) {
  console.error(`[${v.id}]\n  ${v.file}\n  ${v.detail}\n`);
}
process.exit(1);
