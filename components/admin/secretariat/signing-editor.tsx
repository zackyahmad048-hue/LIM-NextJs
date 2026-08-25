"use client";

import { useState } from "react";

import { AttachmentUpload } from "@/components/admin/shared/attachment-upload";
import type {
  QrPagePositionMm,
  QrPositionMm,
} from "@/modules/secretariat/domain/entities";
import { QrPositionEditor } from "./qr-position-editor";

interface SigningEditorProps {
  initialAttachmentUrl?: string | null;
  initialFileName?: string | null;
  initialKetuaPosition?: QrPagePositionMm | null;
  initialSekretarisPosition?: QrPagePositionMm | null;
  initialVerifikasiPosition?: QrPositionMm | null;
}

/**
 * Mengkoordinasikan unggah dokumen (AttachmentUpload) dengan editor
 * posisi QR (QrPositionEditor): saat dokumen berubah, editor ikut
 * memuat halaman dokumen yang baru.
 */
export function SigningEditor({
  initialAttachmentUrl,
  initialFileName,
  initialKetuaPosition,
  initialSekretarisPosition,
  initialVerifikasiPosition,
}: SigningEditorProps) {
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(
    initialAttachmentUrl ?? null,
  );

  return (
    <div className="space-y-4">
      <AttachmentUpload
        initialAttachmentUrl={attachmentUrl}
        initialFileName={initialFileName}
        onUrlChange={setAttachmentUrl}
      />
      <QrPositionEditor
        key={attachmentUrl ?? "no-attachment"}
        attachmentUrl={attachmentUrl}
        initialKetuaPosition={initialKetuaPosition}
        initialSekretarisPosition={initialSekretarisPosition}
        initialVerifikasiPosition={initialVerifikasiPosition}
      />
    </div>
  );
}
