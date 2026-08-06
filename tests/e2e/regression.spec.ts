import "dotenv/config";

import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { PDFDocument, rgb } from "pdf-lib";
import { chromium, type Page } from "playwright";
import { describe, expect, it } from "vitest";

const BASE_URL =
  process.env.E2E_BASE_URL ?? "https://lim-next-js.vercel.app";
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

describe("regresi alur login + surat QR (produksi)", () => {
  it(
    "login -> terbitkan surat -> verifikasi publik -> bersihkan",
    async () => {
      expect(EMAIL, "ADMIN_EMAIL harus diisi di .env").toBeTruthy();
      expect(PASSWORD, "ADMIN_PASSWORD harus diisi di .env").toBeTruthy();

      const stamp = Date.now();
      const registrationNumber = `E2E/${stamp}`;
      const subject = `TES REGRESI ${stamp}`;

      const browser = await chromium.launch();
      try {
        const page: Page = await browser.newPage();
        page.on("dialog", (dialog) => dialog.accept());
        page.on("response", (response) => {
          if (response.status() >= 400) {
            console.log(
              "[e2e] HTTP",
              response.status(),
              response.url().slice(0, 100),
            );
          }
        });

        await page.goto(`${BASE_URL}/admin/login`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        await page.getByPlaceholder("admin@email.com").fill(EMAIL!);
        await page.getByPlaceholder("********").fill(PASSWORD!);
        await page.getByRole("button", { name: /masuk/i }).click();

        await page.waitForURL("**/admin", { timeout: 60_000 });
        await page
          .getByRole("heading", { name: /selamat datang/i })
          .waitFor({ state: "visible", timeout: 30_000 });

        await page.goto(`${BASE_URL}/admin/secretariat/surat-menyurat`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        await page.selectOption("#letterType", "REKOMENDASI");
        await page.fill("#registrationNumber", registrationNumber);
        await page.fill("#date", "2026-08-05");
        await page.fill("#subject", subject);
        await page.fill("#issuer", "Dewan Pimpinan Pusat LIM");

        const pdfPath = join(
          mkdtempSync(join(tmpdir(), "lim-e2e-")),
          "surat.pdf",
        );
        const doc = await PDFDocument.create();
        const sheet = doc.addPage([400, 200]);
        sheet.drawText(subject, {
          x: 50,
          y: 100,
          size: 16,
          color: rgb(0, 0, 0),
        });
        writeFileSync(pdfPath, await doc.save());

        await page.setInputFiles("#file", pdfPath);
        await page.getByRole("button", { name: /terbitkan/i }).click();

        const row = page.locator("li", { hasText: registrationNumber });
        await row.waitFor({ state: "visible", timeout: 60_000 });
        await row.getByText("Surat Sah").waitFor({ state: "visible" });

        const verifyHref = await row
          .getByRole("link", { name: /lihat hasil/i })
          .getAttribute("href");
        expect(verifyHref).toMatch(/^\/verifikasi\/surat\//);

        await page.goto(`${BASE_URL}${verifyHref}`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        const verifBody = await page.locator("body").innerText();
        expect(verifBody).toContain("Surat Sah");
        expect(verifBody).toContain(registrationNumber);
        const iframe = page.locator("iframe");
        await iframe.waitFor({ state: "visible", timeout: 30_000 });
        expect(await iframe.getAttribute("src")).toContain(
          "blob.vercel-storage.com",
        );
        expect(await iframe.getAttribute("src")).toContain("processed.pdf");

        await page.goto(`${BASE_URL}/admin/secretariat/surat-menyurat`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        const rowAfter = page.locator("li", { hasText: registrationNumber });
        if (await rowAfter.count()) {
          await rowAfter.getByTitle("Hapus surat").click();
          await rowAfter.waitFor({ state: "detached", timeout: 30_000 });
        }
      } finally {
        await browser.close();
      }
    },
    300_000,
  );

  it(
    "validasi jenis file: gambar berpratinjau, teks & PDF rusak ditolak",
    async () => {
      expect(EMAIL, "ADMIN_EMAIL harus diisi di .env").toBeTruthy();
      expect(PASSWORD, "ADMIN_PASSWORD harus diisi di .env").toBeTruthy();

      const stamp = Date.now();
      const browser = await chromium.launch();
      try {
        const page: Page = await browser.newPage();
        page.on("dialog", (dialog) => dialog.accept());

        await page.goto(`${BASE_URL}/admin/login`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        await page.getByPlaceholder("admin@email.com").fill(EMAIL!);
        await page.getByPlaceholder("********").fill(PASSWORD!);
        await page.getByRole("button", { name: /masuk/i }).click();
        await page.waitForURL("**/admin", { timeout: 60_000 });

        await page.goto(`${BASE_URL}/admin/secretariat/surat-menyurat`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });

        const tmp = mkdtempSync(join(tmpdir(), "lim-e2e-"));
        const pngPath = join(tmp, "surat.png");
        const txtPath = join(tmp, "surat.txt");
        const corruptPath = join(tmp, "surat.pdf");
        writeFileSync(txtPath, "bukan file surat");
        writeFileSync(corruptPath, "%PDF-1.4\n%dokumen rusak\n");

        const sharp = (await import("sharp")).default;
        await sharp({
          create: {
            width: 400,
            height: 300,
            channels: 3,
            background: { r: 200, g: 60, b: 60 },
          },
        })
          .png()
          .toFile(pngPath);

        async function submit(
          registrationNumber: string,
          subject: string,
          filePath: string,
        ) {
          await page.selectOption("#letterType", "REKOMENDASI");
          await page.fill("#registrationNumber", registrationNumber);
          await page.fill("#date", "2026-08-05");
          await page.fill("#subject", subject);
          await page.fill("#issuer", "Regresi LIM");
          await page.setInputFiles("#file", filePath);
          await page.getByRole("button", { name: /terbitkan/i }).click();
        }

        const pngNumber = `E2E-IMG/${stamp}`;
        await submit(pngNumber, `GAMBAR ${stamp}`, pngPath);
        const pngRow = page.locator("li", { hasText: pngNumber });
        await pngRow.waitFor({ state: "visible", timeout: 60_000 });
        await pngRow.getByText("Surat Sah").waitFor({ state: "visible" });

        const code = await pngRow
          .innerText()
          .then((text) => text.match(/Kode:\s*(\w+)/)?.[1]);
        expect(code).toBeTruthy();

        await page.goto(`${BASE_URL}/verifikasi/surat/${code}`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        const verifBody = await page.locator("body").innerText();
        expect(verifBody).toContain("Surat Sah");
        await expect
          .poll(
            async () =>
              await page
                .locator('img[alt^="Pratinjau"]')
                .getAttribute("src"),
            { timeout: 30_000 },
          )
          .toContain("blob.vercel-storage.com");
        expect(await page.locator("iframe").count()).toBe(0);

        await page.goto(`${BASE_URL}/admin/secretariat/surat-menyurat`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });

        const txtNumber = `E2E-TXT/${stamp}`;
        await submit(txtNumber, `TEKS ${stamp}`, txtPath);
        await expect
          .poll(
            async () => (await page.locator("li", { hasText: txtNumber }).count()) > 0,
            { timeout: 60_000, interval: 1000 },
          )
          .toBe(false);
        await expect
          .poll(
            async () =>
              (await page
                .locator("[data-sonner-toast]")
                .allInnerTexts()
                .then((texts) => texts.join("")))
                .includes("PDF"),
            { timeout: 30_000 },
          )
          .toBe(true);

        const corruptNumber = `E2E-BAD/${stamp}`;
        await submit(corruptNumber, `RUSAK ${stamp}`, corruptPath);
        await expect
          .poll(
            async () => (await page.locator("li", { hasText: corruptNumber }).count()) > 0,
            { timeout: 60_000, interval: 1000 },
          )
          .toBe(false);

        const pngRowAfter = page.locator("li", { hasText: pngNumber });
        if (await pngRowAfter.count()) {
          await pngRowAfter.getByTitle("Hapus surat").click();
          await pngRowAfter.waitFor({ state: "detached", timeout: 30_000 });
        }
      } finally {
        await browser.close();
      }
    },
    300_000,
  );
});
