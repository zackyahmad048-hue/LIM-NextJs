"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  importWajibKhidmahFromGoogleSheet,
  importWajibKhidmahMembers,
} from "@/modules/twk/presentation/twk.action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
}

export function ImportDialog({ open, onOpenChange }: Props) {
  const router = useRouter();

  const [mode, setMode] = useState<"csv" | "sheet">("csv");
  const [csvText, setCsvText] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    setPending(true);

    try {
      const result =
        mode === "csv"
          ? await importWajibKhidmahMembers(csvText)
          : await importWajibKhidmahFromGoogleSheet(sheetUrl);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(
        `${result.imported} anggota berhasil diimpor.`,
      );

      router.refresh();
      setCsvText("");
      setSheetUrl("");
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) {
          setCsvText("");
          setSheetUrl("");
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Impor Data</DialogTitle>

          <DialogDescription>
            Impor anggota Wajib Khidmah dari file CSV atau Google Sheet.
            Pastikan baris pertama berisi kolom:{" "}
            <code className="text-xs">nama</code>,{" "}
            <code className="text-xs">alamat</code>,{" "}
            <code className="text-xs">kelas</code>,{" "}
            <code className="text-xs">pos</code>,{" "}
            <code className="text-xs">tempat</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "csv" ? "default" : "outline"}
              onClick={() => setMode("csv")}
            >
              Tempel CSV
            </Button>

            <Button
              type="button"
              size="sm"
              variant={mode === "sheet" ? "default" : "outline"}
              onClick={() => setMode("sheet")}
            >
              Google Sheet
            </Button>
          </div>

          {mode === "csv" ? (
            <div className="space-y-2">
              <Label htmlFor="csv">Isi CSV</Label>
              <Textarea
                id="csv"
                rows={8}
                placeholder={`nama,alamat,kelas,pos,tempat\nAhmad Fauzi,Jl. Merdeka 1,12,Pos 1,Masjid At-Taqwa`}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="sheet-url">URL Google Sheet</Label>
              <Input
                id="sheet-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />

              <p className="text-xs text-muted-foreground">
                Pastikan sheet diatur ke &quot;Siapa saja yang memiliki tautan
                dapat melihat&quot; agar dapat diambil oleh sistem.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>

            <Button
              type="button"
              disabled={pending}
              onClick={handleSubmit}
            >
              {pending ? "Mengimpor..." : "Impor"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
