import { prisma } from "@/modules/shared/infrastructure/prisma";
import { storage } from "@/modules/shared/infrastructure/storage";
import type { OutgoingMailEntity } from "../domain/entities";
import {
  MissingLetterNumberError,
  SecretariatError,
} from "../domain/secretariat.errors";
import { extractFileIdFromMediaUrl } from "./drive-archive.service";
import { findFiducialPositions } from "./fiducial.service";
import { composeSignedPdf } from "./pdf-sign.service";
import { getLetterVerificationUrl, renderQrPng } from "./qr-code";

export interface SignedLetterArtifacts {
  verificationCode: string;
  qrFileId: string;
  attachmentUrl: string | null;
}

/**
 * Membangun teks multi-baris untuk QR penanda tangan
 * (nama + jabatan), mis. "Ketua" / "Sekretaris".
 */
export function buildSignerQrText(role: string, name: string, position: string | null) {
  return [role, name, position].filter(Boolean).join("\n");
}

/**
 * Menandatangani surat keluar: menerbitkan QR verifikasi otomatis dan
 * mengomposisi tiga QR (Ketua, Sekretaris, Verifikasi) ke dalam dokumen
 * lampiran PDF. Kode verifikasi = nomor surat resmi (fullNumber).
 *
 * Lampiran asli diganti dengan versi ber-QR (Media baru dibuat dan Media
 * lama dihapus). Jika komposisi gagal, surat tetap terbit dengan QR
 * verifikasi mandiri tanpa mengubah lampiran.
 */
export async function signOutgoingMail(
  mail: OutgoingMailEntity,
): Promise<SignedLetterArtifacts> {
  if (!mail.fullNumber) {
    throw new MissingLetterNumberError();
  }

  const verificationCode = mail.fullNumber;
  const url = getLetterVerificationUrl(verificationCode);
  const verifikasiPng = await renderQrPng(url);
  const ketuaPng = mail.ketuaName
    ? await renderQrPng(
        buildSignerQrText("Ketua", mail.ketuaName, mail.ketuaPosition),
      )
    : null;
  const sekretarisPng = mail.sekretarisName
    ? await renderQrPng(
        buildSignerQrText(
          "Sekretaris",
          mail.sekretarisName,
          mail.sekretarisPosition,
        ),
      )
    : null;

  let qrFileId: string;
  try {
    qrFileId = await storage.save(verifikasiPng, "qr-verifikasi.png", "image/png");
  } catch {
    throw new SecretariatError(
      "Gagal menyimpan QR verifikasi surat. Coba lagi nanti.",
    );
  }

  let attachmentUrl = mail.attachmentUrl;
  const attachmentFileId = mail.attachmentUrl
    ? extractFileIdFromMediaUrl(mail.attachmentUrl)
    : null;

  if (attachmentFileId) {
    try {
      const sourcePdf = await storage.read(attachmentFileId);

      // Prioritas posisi QR: simbol fiducial di template (paling presisi) →
      // posisi tersimpan editor → default (diterapkan oleh composeSignedPdf).
      const fiducial = await findFiducialPositions(sourcePdf);
      const ketuaPosition = fiducial.ketua ?? mail.qrKetuaPosition ?? null;
      const sekretarisPosition =
        fiducial.sekretaris ?? mail.qrSekretarisPosition ?? null;
      const verifikasiPosition =
        fiducial.verifikasi ?? mail.qrVerifikasiPosition ?? null;

      const signedPdf = await composeSignedPdf(sourcePdf, {
        ketua: ketuaPng ? { png: ketuaPng, position: ketuaPosition } : null,
        sekretaris: sekretarisPng
          ? { png: sekretarisPng, position: sekretarisPosition }
          : null,
        verifikasi: {
          png: verifikasiPng,
          position: verifikasiPosition,
        },
      });

      const oldMedia = await prisma.media.findUnique({
        where: { fileId: attachmentFileId },
      });

      const newFileId = await storage.save(
        signedPdf,
        oldMedia?.originalName ?? "surat-ber-qr.pdf",
        "application/pdf",
      );

      const media = await prisma.media.create({
        data: {
          originalName: oldMedia?.originalName ?? "surat-ber-qr.pdf",
          mimeType: "application/pdf",
          size: signedPdf.byteLength,
          fileId: newFileId,
          access: "PRIVATE",
          folder: oldMedia?.folder ?? "surat-keluar",
          storageProvider: "BLOB",
          storageKey: newFileId,
          uploadedById: oldMedia?.uploadedById ?? null,
        },
      });

      if (oldMedia) {
        await prisma.media.delete({ where: { id: oldMedia.id } });
      }
      await storage.remove(attachmentFileId).catch(() => undefined);

      attachmentUrl = `/api/media/${encodeURIComponent(media.fileId)}`;
    } catch {
      // Komposisi bersifat best-effort; surat tetap terbit tanpa lampiran QR.
    }
  }

  return { verificationCode, qrFileId, attachmentUrl };
}
