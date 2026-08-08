"use client";

import { useRef, useState } from "react";
import { Eye, FileText, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadOutgoingMailAttachment } from "@/modules/secretariat/presentation/secretariat.action";

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

type UploadActionResult =
  | {
      success: true;
      fileId: string;
      attachmentUrl: string;
      originalName: string;
      size: number;
    }
  | { success: false; message: string };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface AttachmentUploadProps {
  name?: string;
  initialAttachmentUrl?: string | null;
  initialFileName?: string | null;
  uploadAction?: (formData: FormData) => Promise<UploadActionResult>;
}

export function AttachmentUpload({
  name = "attachmentUrl",
  initialAttachmentUrl,
  initialFileName,
  uploadAction = uploadOutgoingMailAttachment,
}: AttachmentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<{
    url: string;
    name: string;
    size: number;
  } | null>(
    initialAttachmentUrl
      ? {
          url: initialAttachmentUrl,
          name: initialFileName ?? "Dokumen terlampir",
          size: 0,
        }
      : null,
  );

  async function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setError(null);

    if (!ALLOWED_MIME_TYPES.has(selected.type)) {
      setError(
        "Jenis file tidak didukung. Gunakan PDF, DOC/DOCX, atau gambar.",
      );
      return;
    }
    if (selected.size > MAX_ATTACHMENT_BYTES) {
      setError("Ukuran file maksimal 2 MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("attachment", selected);
    const result = await uploadAction(formData);
    setUploading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setFile({
      url: result.attachmentUrl,
      name: result.originalName,
      size: result.size,
    });
  }

  function handleRemove() {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="attachment" className="text-xs">
        Dokumen Surat
      </Label>

      <input type="hidden" name={name} value={file?.url ?? ""} readOnly />

      {file ? (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{file.name}</p>
            {file.size > 0 && (
              <p className="text-[11px] text-muted-foreground">
                {formatSize(file.size)}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            asChild
          >
            <a href={file.url} target="_blank" rel="noreferrer" title="Lihat">
              <Eye className="size-4" />
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-destructive"
            onClick={handleRemove}
            title="Hapus dokumen"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="attachment"
          className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-8 text-center transition-colors hover:bg-muted/50"
        >
          <Upload className="size-5 text-muted-foreground" />
          <span className="text-xs font-medium">
            {uploading ? "Mengunggah..." : "Pilih dokumen surat"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            PDF, DOC/DOCX, atau gambar &middot; maksimal 2 MB
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        id="attachment"
        type="file"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
        className="hidden"
        onChange={handleSelect}
        disabled={uploading}
      />

      {uploading && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Mengunggah dokumen...
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
