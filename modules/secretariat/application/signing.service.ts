import { storage } from "@/modules/shared/infrastructure/storage";
import type { OutgoingMailEntity } from "../domain/entities";
import {
  MissingLetterNumberError,
  SecretariatError,
} from "../domain/secretariat.errors";
import { getLetterVerificationUrl, renderQrPng } from "./qr-code";

export interface SignedLetterArtifacts {
  verificationCode: string;
  qrFileId: string;
}

/**
 * Menandatangani surat keluar: menerbitkan QR verifikasi otomatis.
 * Kode verifikasi = nomor surat resmi (fullNumber), sehingga bisa
 * diverifikasi dengan scan QR atau ketik kode/nomor manual.
 */
export async function signOutgoingMail(
  mail: OutgoingMailEntity,
): Promise<SignedLetterArtifacts> {
  if (!mail.fullNumber) {
    throw new MissingLetterNumberError();
  }

  const verificationCode = mail.fullNumber;
  const url = getLetterVerificationUrl(verificationCode);
  const qrPng = await renderQrPng(url);

  let qrFileId: string;
  try {
    qrFileId = await storage.save(qrPng, "qr-verifikasi.png", "image/png");
  } catch {
    throw new SecretariatError(
      "Gagal menyimpan QR verifikasi surat. Coba lagi nanti.",
    );
  }

  return { verificationCode, qrFileId };
}
