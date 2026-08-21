"use client";

/* eslint-disable @next/next/no-img-element -- Blob object URLs preview cannot use next/image */

import { useRef, useState } from "react";
import {
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  uploadLembagaDokumen,
  uploadLembagaFoto,
  type UploadLembagaFileResult,
} from "@/modules/twk-lembaga/presentation/lembaga.action";

const PHOTO_MAX_BYTES = 200 * 1024;
const DOCUMENT_MAX_BYTES = 5 * 1024 * 1024;

const PHOTO_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadedFile = {
  fileId: string;
  url: string;
  originalName: string;
  size: number;
};

interface FileUploadFieldProps {
  label: string;
  description?: string;
  kind: "foto" | "dokumen";
  onChange(value: string | null): void;
  required?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadField({
  label,
  description,
  kind,
  onChange,
  required = false,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isFoto = kind === "foto";
  const maxBytes = isFoto ? PHOTO_MAX_BYTES : DOCUMENT_MAX_BYTES;
  const accept = isFoto ? "image/jpeg,image/png,image/webp" : "application/pdf";

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setError(null);

    if (isFoto && !PHOTO_MIME_TYPES.has(selected.type)) {
      setError("Hanya file gambar (JPG/PNG/WebP) yang diperbolehkan.");
      return;
    }
    if (!isFoto && selected.type !== "application/pdf") {
      setError("Hanya file PDF yang diperbolehkan.");
      return;
    }
    if (selected.size > maxBytes) {
      setError(`Ukuran file maksimal ${isFoto ? "200 KB" : "5 MB"}.`);
      return;
    }

    setPreviewUrl(URL.createObjectURL(selected));

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selected);
    const action = isFoto ? uploadLembagaFoto : uploadLembagaDokumen;
    action(formData)
      .then((result: UploadLembagaFileResult) => {
        if (!result.success) {
          setError(result.message);
          return;
        }
        setFile({
          fileId: result.fileId,
          url: result.url,
          originalName: result.originalName,
          size: result.size,
        });
        onChange(result.fileId);
      })
      .catch(() => setError("Gagal mengunggah berkas."))
      .finally(() => setUploading(false));
  }

  function handleRemove() {
    setFile(null);
    setError(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      {file ? (
        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2.5">
          {isFoto && previewUrl ? (
            <img
              src={previewUrl}
              alt={file.originalName}
              className="h-16 w-14 shrink-0 rounded-md border object-cover"
            />
          ) : (
            <FileText className="size-5 shrink-0 text-muted-foreground" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{file.originalName}</p>
            <p className="text-[11px] text-muted-foreground">
              {formatSize(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            asChild
          >
            <a
              href={previewUrl ?? file.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Lihat berkas"
              title="Lihat"
            >
              <Eye className="size-4" />
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-destructive"
            onClick={handleRemove}
            aria-label="Hapus berkas"
            title="Hapus berkas"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={label}
          className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-7 text-center transition-colors hover:bg-muted/50"
        >
          {isFoto ? (
            <ImageIcon className="size-5 text-muted-foreground" />
          ) : (
            <Upload className="size-5 text-muted-foreground" />
          )}
          <span className="text-xs font-medium">
            {uploading
              ? "Mengunggah..."
              : isFoto
                ? "Pilih foto format 3:4"
                : "Pilih dokumen PDF"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {isFoto ? "JPG/PNG/WebP" : "PDF"} &middot; maksimal{" "}
            {isFoto ? "200 KB" : "5 MB"}
          </span>
        </label>
      )}

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <input
        ref={inputRef}
        id={label}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleSelect}
        disabled={uploading}
      />

      {uploading && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Mengunggah berkas...
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
