"use client";

import { useState } from "react";

import { Import } from "lucide-react";
import { toast } from "sonner";

import { importWajibKhidmahFromGoogleSheet } from "@/modules/twk/presentation/twk.action";
import { parseCsv } from "@/modules/twk/application/service";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PreviewRow {
  nama: string;
  alamat: string;
  kelas: string;
  posWajibKhidmah: string;
  tempatWajibKhidmah: string;
}

interface PreviewDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialUrl?: string;
}

export function PreviewDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialUrl = "",
}: PreviewDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  function setOpen(value: boolean) {
    if (isControlled) {
      controlledOnOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  }

  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleFetch() {
    setLoading(true);
    setError(null);
    setRows([]);

    const exportUrl = extractGoogleSheetUrl(url);
    if (!exportUrl) {
      setError("URL Google Sheet tidak valid.");
      setLoading(false);
      return;
    }

    fetch(exportUrl, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data.");
        return res.text();
      })
      .then((csv) => {
        const parsed = parseCsv(csv);
        if (parsed.length === 0) {
          setError(
            "Tidak ada data valid ditemukan. Pastikan kolom pertama berisi nama.",
          );
          return;
        }
        setRows(
          parsed.map((m) => ({
            nama: m.nama,
            alamat: m.alamat ?? "",
            kelas: m.kelas ?? "",
            posWajibKhidmah: m.posWajibKhidmah ?? "",
            tempatWajibKhidmah: m.tempatWajibKhidmah ?? "",
          })),
        );
      })
      .catch(() => {
        setError("Gagal mengambil data dari Google Sheet.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setImporting(true);
    try {
      const result = await importWajibKhidmahFromGoogleSheet(url);
      if (result.ok) {
        toast.success(
          `${result.imported ?? rows.length} anggota berhasil diimpor.`,
        );
        setUrl("");
        setRows([]);
        setError(null);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Gagal mengimpor data.");
    } finally {
      setImporting(false);
    }
  }

  function handleClose() {
    setUrl("");
    setRows([]);
    setError(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Preview Data Google Sheet</DialogTitle>
          <DialogDescription>
            Tempel URL Google Sheet untuk melihat preview data
            sebelum diimpor. Pastikan sheet memiliki kolom: nama,
            alamat, kelas, pos, tempat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="preview-url">URL Google Sheet</Label>
              <Input
                id="preview-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFetch();
                }}
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="self-end"
              onClick={handleFetch}
              disabled={loading || !url.trim()}
            >
              {loading ? "Mengambil..." : "Preview"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {rows.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {rows.length} baris ditemukan.
              </p>

              <div className="max-h-72 overflow-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">
                        No
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Nama
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Alamat
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Kelas
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Pos
                      </th>
                      <th className="px-3 py-2 text-left font-medium">
                        Tempat
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.slice(0, 50).map((row, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2">{row.nama}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {row.alamat || "—"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {row.kelas || "—"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {row.posWajibKhidmah || "—"}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {row.tempatWajibKhidmah || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 50 && (
                  <p className="p-3 text-center text-xs text-muted-foreground">
                    Menampilkan 50 dari {rows.length} baris.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Tutup
          </Button>
          <Button
            type="button"
            disabled={rows.length === 0 || importing}
            onClick={handleImport}
          >
            <Import className="size-4" />
            {importing
              ? "Mengimpor..."
              : `Impor ${rows.length} data`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function extractGoogleSheetUrl(input: string): string | null {
  const trimmed = input.trim();
  const match = trimmed.match(
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)(?:\/edit)?(?:\?.*gid=(\d+))?/,
  );
  if (!match) return null;

  const id = match[1];
  const gid = match[2];

  return gid
    ? `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`
    : `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
}