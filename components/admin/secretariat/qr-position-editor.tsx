"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, RotateCcw, Scan } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type {
  QrPagePositionMm,
  QrPositionMm,
} from "@/modules/secretariat/domain/entities";
import type { FiducialDetection } from "@/modules/secretariat/application/fiducial.service";
import {
  DEFAULT_KETUA_POSITION,
  DEFAULT_SEKRETARIS_POSITION,
  DEFAULT_VERIFIKASI_POSITION,
  QR_SIZE_MM,
} from "@/modules/secretariat/application/pdf-sign.service";
import { cn } from "@/lib/utils";

const MM_PER_PT = 25.4 / 72;
const MAX_DISPLAY_WIDTH = 720;

interface EditorPage {
  page: number;
  widthPt: number;
  heightPt: number;
  width: number;
  height: number;
  dataUrl: string;
}

type MarkerType = "ketua" | "sekretaris" | "verifikasi";

interface QrPositionEditorProps {
  attachmentUrl: string | null;
  initialKetuaPosition?: QrPagePositionMm | null;
  initialSekretarisPosition?: QrPagePositionMm | null;
  initialVerifikasiPosition?: QrPositionMm | null;
}

function extractFileId(url: string): string | null {
  const segments = url.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Lebar tampilan yang dipakai untuk konversi piksel ⇄ mm.
 * Mengikuti natural width namun dibatasi agar pas di kolom form.
 */
function displayWidthOf(page: EditorPage): number {
  return Math.min(MAX_DISPLAY_WIDTH, page.width);
}

interface MarkerGeometry {
  page: EditorPage;
  mm: { x: number; y: number };
}

/** Konversi posisi (mm, dari kiri-bawah) menjadi piksel tampilan (dari kiri-atas). */
function mmToDisplay(page: EditorPage, xMm: number, yMm: number) {
  const displayWidth = displayWidthOf(page);
  const widthMm = page.widthPt * MM_PER_PT;
  const heightMm = page.heightPt * MM_PER_PT;
  const pxPerMm = displayWidth / widthMm;
  const qrPx = QR_SIZE_MM * pxPerMm;
  const xPx = xMm * pxPerMm;
  const yPxFromTop = heightMm * pxPerMm - (yMm + QR_SIZE_MM) * pxPerMm;
  return { x: xPx, y: yPxFromTop, size: qrPx };
}

export function QrPositionEditor({
  attachmentUrl,
  initialKetuaPosition,
  initialSekretarisPosition,
  initialVerifikasiPosition,
}: QrPositionEditorProps) {
  const [pages, setPages] = useState<EditorPage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [ketua, setKetua] = useState<QrPagePositionMm>(
    initialKetuaPosition ?? { ...DEFAULT_KETUA_POSITION },
  );
  const [sekretaris, setSekretaris] = useState<QrPagePositionMm>(
    initialSekretarisPosition ?? { ...DEFAULT_SEKRETARIS_POSITION },
  );
  const [verifikasi, setVerifikasi] = useState<QrPositionMm>(
    initialVerifikasiPosition ?? { ...DEFAULT_VERIFIKASI_POSITION },
  );

  const [dragging, setDragging] = useState<MarkerType | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [fiducial, setFiducial] = useState<FiducialDetection | null>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!attachmentUrl) return;
    const fileId = extractFileId(attachmentUrl);
    if (!fileId) return;

    let cancelled = false;
    fetch(
      `/api/admin/secretariat/qr-editor?fileId=${encodeURIComponent(fileId)}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (!json.success) {
          setError(json.message ?? "Gagal memuat halaman dokumen.");
          setPages(null);
          return;
        }
        setPages(json.pages as EditorPage[]);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Gagal memuat halaman dokumen.");
        setPages(null);
      });

    return () => {
      cancelled = true;
    };
  }, [attachmentUrl]);

  /** Posisi pointer dalam piksel tampilan → mm (dari kiri-bawah halaman). */
  function pointerToMm(
    page: EditorPage,
    clientX: number,
    clientY: number,
  ): { x: number; y: number } {
    const container = pageRefs.current.get(page.page);
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    const displayWidth = displayWidthOf(page);
    const scale = displayWidth / rect.width;

    const offsetX = (clientX - rect.left) * scale;
    const offsetY = (clientY - rect.top) * scale;

    const widthMm = page.widthPt * MM_PER_PT;
    const heightMm = page.heightPt * MM_PER_PT;
    const pxPerMm = displayWidth / widthMm;

    const xMm = clamp(offsetX / pxPerMm, 0, widthMm - QR_SIZE_MM);
    const yFromBottomMm = clamp(
      heightMm - offsetY / pxPerMm - QR_SIZE_MM,
      0,
      heightMm - QR_SIZE_MM,
    );
    return { x: xMm, y: yFromBottomMm };
  }

  function handleMove(page: EditorPage, clientX: number, clientY: number) {
    if (!dragging) return;
    const pos = pointerToMm(page, clientX, clientY);
    if (dragging === "verifikasi") {
      setVerifikasi(pos);
    } else {
      const next: QrPagePositionMm = { page: page.page, ...pos };
      if (dragging === "ketua") setKetua(next);
      else setSekretaris(next);
    }
  }

  function resetPositions() {
    setKetua({ ...DEFAULT_KETUA_POSITION });
    setSekretaris({ ...DEFAULT_SEKRETARIS_POSITION });
    setVerifikasi({ ...DEFAULT_VERIFIKASI_POSITION });
    setFiducial(null);
  }

  async function detectFiducial() {
    if (!attachmentUrl) return;
    const fileId = extractFileId(attachmentUrl);
    if (!fileId) return;

    setDetecting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/secretariat/qr-editor?fileId=${encodeURIComponent(fileId)}&detect=1`,
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? "Gagal mendeteksi simbol.");
        return;
      }
      const result = json.fiducial as FiducialDetection | null;
      setFiducial(result);
      if (result?.ketua) setKetua(result.ketua);
      if (result?.sekretaris) setSekretaris(result.sekretaris);
      if (result?.verifikasi) setVerifikasi(result.verifikasi);
      if (
        !result?.ketua &&
        !result?.sekretaris &&
        !result?.verifikasi
      ) {
        setError(
          "Simbol fiducial tidak ditemukan. Tempel kotak magenta (Ketua), cyan (Sekretaris), dan orange (Verifikasi) di template.",
        );
      }
    } catch {
      setError("Gagal mendeteksi simbol fiducial.");
    } finally {
      setDetecting(false);
    }
  }

  function renderMarker(page: EditorPage, type: MarkerType, show: boolean) {
    if (!show) return null;
    const geometry: MarkerGeometry | null =
      type === "verifikasi"
        ? { page, mm: verifikasi }
        : type === "ketua"
          ? { page, mm: ketua }
          : { page, mm: sekretaris };

    const { x, y, size } = mmToDisplay(
      geometry.page,
      geometry.mm.x,
      geometry.mm.y,
    );

    const palette: Record<MarkerType, string> = {
      ketua: "border-sky-300 bg-sky-500/80",
      sekretaris: "border-emerald-300 bg-emerald-500/80",
      verifikasi: "border-violet-300 bg-violet-500/80",
    };
    const labels: Record<MarkerType, string> = {
      ketua: "KETUA",
      sekretaris: "SEK",
      verifikasi: "VERIF",
    };

    return (
      <div
        key={type}
        className={cn(
          "absolute z-10 flex cursor-grab touch-none select-none items-center justify-center rounded-md border-2 text-[10px] font-semibold text-white active:cursor-grabbing",
          palette[type],
        )}
        style={{ left: x, top: y, width: size, height: size }}
        aria-label={`QR ${labels[type]}`}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(type);
        }}
        onPointerMove={(event) =>
          handleMove(page, event.clientX, event.clientY)
        }
        onPointerUp={() => setDragging(null)}
        onPointerCancel={() => setDragging(null)}
      >
        <MapPin className="size-3" />
      </div>
    );
  }

  const hasAttachment = Boolean(attachmentUrl);
  const loading = hasAttachment && pages === null && !error;

  return (
    <div className="space-y-3">
      <input
        type="hidden"
        name="qrKetuaPosition"
        value={JSON.stringify(ketua)}
        readOnly
      />
      <input
        type="hidden"
        name="qrSekretarisPosition"
        value={JSON.stringify(sekretaris)}
        readOnly
      />
      <input
        type="hidden"
        name="qrVerifikasiPosition"
        value={JSON.stringify(verifikasi)}
        readOnly
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Seret marker QR (Ketua, Sekretaris, Verifikasi) ke posisi yang
          diinginkan, atau pakai tombol <strong>Deteksi Simbol</strong> untuk
          menempatkannya otomatis di atas kotak fiducial pada template.
          Koordinat disimpan dalam mm dari pojok kiri-bawah halaman.
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={detectFiducial}
            disabled={!hasAttachment || detecting}
          >
            {detecting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Scan className="size-3.5" />
            )}
            Deteksi Simbol
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetPositions}
          >
            <RotateCcw className="size-3.5" />
            Reset posisi default
          </Button>
        </div>
      </div>

      {fiducial && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          Simbol fiducial terdeteksi. Posisi QR Ketua, Sekretaris, dan
          Verifikasi diisi otomatis sesuai simbol pada template.
        </p>
      )}

      {!hasAttachment && !loading && (
        <p className="rounded-lg border border-dashed px-4 py-6 text-center text-xs text-muted-foreground">
          Unggah dokumen surat terlebih dahulu untuk mengatur posisi QR.
        </p>
      )}

      {loading && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Memuat halaman dokumen...
        </p>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {pages && !loading && (
        <div className="space-y-4">
          {pages.map((page) => {
            const widthMm = page.widthPt * MM_PER_PT;
            const heightMm = page.heightPt * MM_PER_PT;
            return (
              <div key={page.page} className="space-y-1.5">
                <Label className="text-xs">
                  Halaman {page.page}
                  <span className="ml-2 font-normal text-muted-foreground">
                    {Math.round(widthMm)} × {Math.round(heightMm)} mm
                  </span>
                </Label>

                <div
                  ref={(el) => {
                    if (el) pageRefs.current.set(page.page, el);
                    else pageRefs.current.delete(page.page);
                  }}
                  className="relative w-fit touch-none overflow-hidden rounded-lg border bg-white"
                  style={{ width: "100%", maxWidth: `${MAX_DISPLAY_WIDTH}px` }}
                  onPointerMove={(event) =>
                    handleMove(page, event.clientX, event.clientY)
                  }
                  onPointerUp={() => setDragging(null)}
                  onPointerLeave={() => setDragging(null)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.dataUrl}
                    alt={`Halaman ${page.page}`}
                    className="block w-full"
                    draggable={false}
                  />
                  {renderMarker(
                    page,
                    "ketua",
                    ketua.page === page.page,
                  )}
                  {renderMarker(
                    page,
                    "sekretaris",
                    sekretaris.page === page.page,
                  )}
                  {renderMarker(page, "verifikasi", true)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
