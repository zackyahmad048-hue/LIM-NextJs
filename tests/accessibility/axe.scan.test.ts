/**
 * E2E aksesibilitas — pemindaian WCAG 2.2 A/AA + best-practice (axe-core) lewat Playwright.
 *
 * Cakupan mengikuti kesepakatan "Audit Penutup" (liat .scratch/admin-redesign/issues/13):
 * - Publik (21 rute) + chrome: viewport desktop & mobile.
 * - Admin (13 rute representatif per pola permukaan) + chrome: desktop, tablet, mobile.
 * - Login admin opsional via env `PLAYWRIGHT_STORAGE_STATE`; bila tak disediakan, rute
 *   admin yang melompat ke /admin/login dicatat "auth-blocked" (bukan gagal).
 *
 * Menjalankan: `npm run e2e` or `npm run a11y:scan` — butuh app berjalan (default
 * http://localhost:3000; override `A11Y_BASE_URL`). Bila app tidak hidup (atau `/`
 * merespons 5xx), suite ini otomatis tidak jalan (unit suite tetap hijau) dan hanya
 * memberi catatan di console. Sebaliknya, bila server sehat, suite TIDAK boleh lolos
 * vakum: rute yang masih menampilkan halaman error gagal, dan afterAll memastikan
 * setidaknya satu pemindaian nyata terjadi.
 */
import { existsSync } from "node:fs";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { chromium, type Browser, type Page } from "playwright";
import AxeBuilder from "@axe-core/playwright";

import { prisma } from "@/modules/shared/infrastructure/prisma";

const BASE = process.env.A11Y_BASE_URL ?? "http://localhost:3000";
const STORAGE_STATE = process.env.PLAYWRIGHT_STORAGE_STATE;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CACHED_STORAGE_PATH = "/tmp/a11y-storage-state.json";

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 1024, height: 768 },
  mobile: { width: 390, height: 844 },
} as const;

const PUBLIC_VIEWPORT_KEYS = ["desktop", "mobile"] as const;
const ADMIN_VIEWPORT_KEYS = ["desktop", "tablet", "mobile"] as const;

interface RouteSpec {
  path: string;
}

/**
 * Inventaris rute audit (kesepakatan Round 7). Sampel detail dinamis memakai id/slug
 * nyata dari DB saat audit berjalan; bila data tak ada, rute tak disertakan agar tidak
 * memindai halaman 404/empty-state yang bukan permukaannya.
 */
const PUBLIC_ROUTES: RouteSpec[] = [
  { path: "/" },
  { path: "/profil" },
  { path: "/profil/tentang" },
  { path: "/profil/visi-misi" },
  { path: "/profil/pengurus-pusat" },
  { path: "/profil/bidang" },
  { path: "/profil/bidang/tim-wajib-khidmah" },
  { path: "/profil/bidang/safari-ramadan" },
  { path: "/profil/bidang/safari-dakwah-rutinan" },
  { path: "/kontak" },
  { path: "/media" },
  { path: "/artikel" },
  { path: "/falak" },
  { path: "/falak/jadwal-shalat" },
  { path: "/falak/kiblat" },
  { path: "/falak/hisab" },
  { path: "/falak/rukyat" },
  { path: "/falak/gerhana" },
  { path: "/falak/kalender-hijriah" },
  { path: "/wajib-khidmah/permohonan" },
  { path: "/admin/login" },
];

/**
 * Rute detail dinamis (id unit / id surat) di-resolusi dari database yang sedang
 * diuji saat modul di-load — bukan hardcode — agar valid pada DB apa pun (main
 * lokal, branch CI, string kosong). Bila data tidak ada, rute tidak disertakan
 * (komitmen "tidak memindai 404/empty-state", lihat komentar inventaris di atas).
 */
async function resolveDynamicAdminRoutes(): Promise<RouteSpec[]> {
  const [unit, mail] = await Promise.all([
    prisma.organizationUnit.findFirst({
      where: { deletedAt: null },
      select: { id: true },
    }),
    prisma.outgoingMail.findFirst({
      where: { deletedAt: null },
      select: { id: true },
    }),
  ]);

  const routes: RouteSpec[] = [];
  if (unit) {
    routes.push({ path: `/admin/secretariat/pendataan/units/${unit.id}/officers` });
  }
  if (mail) {
    routes.push({ path: `/admin/secretariat/outgoing-mail/${mail.id}/cetak` });
  }
  return routes;
}

const DYNAMIC_ADMIN_ROUTES: RouteSpec[] = await resolveDynamicAdminRoutes().catch(
  (error) => {
    console.warn(
      `[axe.scan] Resolusi rute dinamis gagal (${String(error)}) — rute detail unit/surat tidak disertakan.`,
    );
    return [];
  },
);

const ADMIN_ROUTES: RouteSpec[] = [
  { path: "/admin" },
  { path: "/admin/secretariat/pendataan" },
  { path: "/admin/secretariat/pendataan/units/new" },
  { path: "/admin/secretariat/pendataan/officers/new" },
  { path: "/admin/secretariat/surat-menyurat" },
  { path: "/admin/secretariat/outgoing-mail/list" },
  { path: "/admin/falak" },
  { path: "/admin/content" },
  { path: "/admin/program/list" },
  { path: "/admin/system/roles" },
  { path: "/admin/system/users" },
  ...DYNAMIC_ADMIN_ROUTES,
];

interface ScanCase {
  spec: RouteSpec;
  viewports: readonly (keyof typeof VIEWPORTS)[];
}

const ALL_ROUTES: ScanCase[] = [
  ...PUBLIC_ROUTES.map((spec) => ({ spec, viewports: PUBLIC_VIEWPORT_KEYS })),
  ...ADMIN_ROUTES.map((spec) => ({ spec, viewports: ADMIN_VIEWPORT_KEYS })),
];

let browser: Browser | null = null;
let authBlockedCount = 0;
let scannedCount = 0;
let storageStatePath: string | null = null;

async function isReachable(url: string, timeoutMs = 15_000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url);
    clearTimeout(timer);
    // Hanya jawaban sukses (2xx/3xx) yang dianggap "sehat". Server yang menjawab
    // 5xx berarti app hidup tapi sedang rusak — kondisi abnormal itu harus
    // terlihat (skip seluruh rute), bukan dipindai karena memindai halaman error
    // bisa lolos secara hampa.
    return res.ok;
  } catch {
    return false;
  }
}

// Probe keterjangkauan di TOP-LEVEL (bukan beforeAll) agar `it.skipIf` bisa
// menandai seluruh rute sebagai "skipped" saat app tidak hidup — kondisi itu
// TAMPAK di laporan, bukan lolos hampa seperti "passed" palsu berdurasi milidetik.
const reachable = await isReachable(BASE);
if (!reachable) {
  console.warn(
    `[axe.scan] ${BASE} tidak terjangkau — seluruh rute di-skip (lihat "skipped" pada laporan). Mulai dulu app (npm run dev / start) atau set A11Y_BASE_URL.`,
  );
}

describe("axe.scan (WCAG 2.2 A/AA + best-practice)", () => {
  beforeAll(async () => {
    browser = await chromium.launch();
    authBlockedCount = 0;
    scannedCount = 0;

    if (!STORAGE_STATE && existsSync(CACHED_STORAGE_PATH)) {
      storageStatePath = CACHED_STORAGE_PATH;
      console.warn(`[axe.scan] Memakai storageState admin tersimpan: ${storageStatePath}`);
    }

    if (!STORAGE_STATE && !storageStatePath && ADMIN_EMAIL && ADMIN_PASSWORD) {
      try {
        const ctx = await browser.newContext({
          viewport: VIEWPORTS.desktop,
        });
        const loginPage = await ctx.newPage();
        await loginPage.addInitScript(() => localStorage.setItem("theme", "light"));
        await loginPage.goto(`${BASE}/admin/login`, {
          timeout: 120_000,
          waitUntil: "load",
        });
        await loginPage.locator('input[type="email"]').fill(ADMIN_EMAIL);
        await loginPage.locator('input[type="password"]').fill(ADMIN_PASSWORD);
        await Promise.all([
          loginPage.waitForURL((u) => !u.pathname.endsWith("/login"), {
            timeout: 90_000,
          }),
          loginPage.locator('button[type="submit"]').click(),
        ]);
        storageStatePath = CACHED_STORAGE_PATH;
        await ctx.storageState({ path: storageStatePath });
        await loginPage.close();
        await ctx.close();
        console.warn(`[axe.scan] Sesi admin diperoleh via login (storageState: ${storageStatePath}).`);
      } catch {
        storageStatePath = null;
        console.warn(
          "[axe.scan] Login admin gagal — rute admin akan di-skip. Periksa ADMIN_EMAIL/ADMIN_PASSWORD.",
        );
      }
    }

    // Warm-up: kompilasi sekali untuk semua rute agar Turbopack tidak
    // recompile di tengah suite (recompile menghasilkan 404/500 sementara
    // dan perubahan gaya di tengah pemindaian).
    try {
      const warmCtx = await browser.newContext({
        storageState: storageStatePath ?? STORAGE_STATE ?? undefined,
      });
      const warmPage = await warmCtx.newPage();
      await warmPage.addInitScript(() => localStorage.setItem("theme", "light"));
      for (const { spec } of ALL_ROUTES) {
        try {
          await warmPage.goto(`${BASE}${spec.path}`, {
            timeout: 120_000,
            waitUntil: "load",
          });
        } catch {
          await warmPage.goto(`${BASE}${spec.path}/`, {
            timeout: 120_000,
            waitUntil: "load",
          });
        }
        await warmPage.waitForTimeout(30);
      }
      await warmPage.close();
      await warmCtx.close();
      console.warn(`[axe.scan] Warm-up ${ALL_ROUTES.length} rute selesai.`);
    } catch {
      console.warn("[axe.scan] Warm-up gagal — lanjut tanpa warm-up.");
    }
  }, 900_000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
      browser = null;
    }
    if (reachable && scannedCount === 0) {
      throw new Error(
        "[axe.scan] Server sehat tetapi tidak satu pun pemindaian berjalan — audit kosong, jangan sampai mengaku hijau.",
      );
    }
    if (authBlockedCount > 0) {
      console.warn(
        `[axe.scan] ${authBlockedCount} rute admin di-skip karena tidak ada sesi login — set PLAYWRIGHT_STORAGE_STATE untuk cakupan admin penuh.`,
      );
    }
  });

  it.skipIf(!reachable).each(ALL_ROUTES)(
    "$spec.path ($viewports.length viewports)",
    async ({ spec, viewports }) => {
      if (!browser) {
        throw new Error("browser tidak tersedia meskipun server sehat.");
      }

      const context = await browser.newContext({
        viewport: VIEWPORTS.desktop,
        storageState: storageStatePath ?? STORAGE_STATE ?? undefined,
      });
      const page: Page = await context.newPage();
      // Tema light dipaksa deterministik lewat storage agar pemindaian kontras
      // konsisten (next-themes defaultTheme="dark"). Cakupan tema gelap
      // ditangani terpisah (lihat issue 13).
      await page.addInitScript(() => localStorage.setItem("theme", "light"));
      await page.emulateMedia({ colorScheme: "light" });
      let url = `${BASE}${spec.path}`;

      try {
        await page.goto(url, { timeout: 120_000, waitUntil: "load" });
      } catch {
        url = `${BASE}${spec.path}/`;
        await page.goto(url, { timeout: 120_000, waitUntil: "load" });
      }

      if (spec.path.startsWith("/admin") && page.url().includes("/admin/login")) {
        authBlockedCount += 1;
        await page.close();
        return;
      }

      const canonical = page.url();
      const hasErrorMarker = async () =>
        (await page.locator(".next-error-h1, #__next_error__").count()) > 0;
      const settlePage = async () => {
        // Dev server (Turbopack) menjawab 404/500 sementara saat recompile —
        // beri waktu compile. Berbatas agar tidak melebihi batas waktu tes.
        for (let attempt = 0; attempt < 2; attempt++) {
          if (!(await hasErrorMarker())) return true;
          await page.waitForTimeout(3000);
          if (!(await hasErrorMarker())) return true;
          await page.goto(canonical, { timeout: 90_000, waitUntil: "load" });
          await page.waitForTimeout(3000);
        }
        return !(await hasErrorMarker());
      };

      for (const viewportKey of viewports) {
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        if (page.url() !== canonical) {
          await page.goto(canonical, { timeout: 120_000, waitUntil: "load" });
        }
        await page.waitForLoadState("load");
        // Dev server Turbopack menyuntikkan CSS bertahap; tunggu jaringan tuntas
        // dan lemma dua frame agar CSSOM (termasuk var(--primary)) sudah ter-resolve
        // saat axe mengukur kontras.
        await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() =>
                requestAnimationFrame(() => resolve()),
              ),
            ),
        );
        await page.waitForTimeout(300);

        await page.waitForTimeout(400);
        const settled = await settlePage();
        // Rute yang tetap menampilkan halaman error setelah retry adalah
        // kegagalan nyata — bukan sesuatu yang boleh lolos hampa. Sertakan
        // konteks (url, judul, teks error) agar kegagalan CI dapat didiagnosis
        // langsung dari log tes.
        const errDetail = await page
          .evaluate(() => {
            const h = document.querySelector(".next-error-h1");
            return (h?.textContent ?? "").trim();
          })
          .catch(() => "");
        const pageTitle = await page.title().catch(() => "");
        expect(
          settled,
          `Rute ${spec.path}: tetap menampilkan halaman error setelah retry (url=${page.url()} title=${JSON.stringify(pageTitle)} err=${JSON.stringify(errDetail)}).`,
        ).toBe(true);
        await page.waitForTimeout(300);

        // Tema light dijamin konsisten: jika provider tema menambahkan kelas
        // `.dark` (mis. karena OS memakai dark), hapus agar token `:root` (light)
        // terpasang. Cakupan tema gelap ditangani terpisah (lihat issue 13).
        await page.evaluate(() => {
          const d = document.documentElement;
          d.classList.remove("dark");
          d.style.colorScheme = "light";
        });
        await page.waitForTimeout(100);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "best-practice"])
          .analyze();
        scannedCount += 1;

        const themeSnapshot = await page.evaluate(
          () => document.documentElement.getAttribute("class") ?? "",
        );

        const inSitu: string[] = [];
        for (const v of results.violations) {
          for (const n of v.nodes.slice(0, 4)) {
            if (n.target[0] && v.id === "color-contrast") {
              try {
                inSitu.push(
                  await page
                    // target bisa berupa cross-tree selector (array) — cukup
                    // ambil representasi stringnya untuk diagnostik.
                    .locator(String(n.target[0]))
                    .evaluate((el) => {
                      const cs = getComputedStyle(el);
                      const parent =
                        el.parentElement && getComputedStyle(el.parentElement);
                      return `in-situ fg=${cs.color} bg=${parent?.backgroundColor ?? "(none)"} cls=${(el.className || "").toString().slice(0, 70)}`;
                    }),
                );
              } catch {
                /* node tak lagi ada di DOM saat dikirim ulang */
              }
            }
          }
        }
        const survey = inSitu.join("\n");

        expect(
          results.violations,
          [
            `Rute ${spec.path} @${viewportKey}`,
            `(tema=html.${themeSnapshot.split(" ").slice(-2).join(".") || "(none)"}` +
              (survey ? `\n${survey}` : "") +
              `)`,
            ...results.violations.map(
              (v) =>
                `- [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node)` +
                v.nodes
                  .slice(0, 2)
                  .map((n) => {
                    const pairs = n.any
                      .map((r) => {
                        const d = r.data as
                          | {
                              fgColor?: string;
                              bgColor?: string;
                              expectedContrastRatio?: string;
                            }
                          | undefined;
                        return d?.fgColor
                          ? `fg=~${d.fgColor} bg=~${d.bgColor} need=${d.expectedContrastRatio}`
                          : null;
                      })
                      .filter(Boolean)
                      .join("; ");
                    return `\n    target=${n.target.join(" · ")} html=${n.html.slice(0, 160)}${pairs ? `\n      (${pairs})` : ""}`;
                  })
                  .join(""),
            ),
          ].join("\n"),
        ).toEqual([]);
      }

      await page.close();
    },
    360_000,
  );
});