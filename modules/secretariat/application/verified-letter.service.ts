import { randomBytes } from "crypto";
import QRCode from "qrcode";
import { PDFDocument, rgb } from "pdf-lib";
import sharp from "sharp";

import { blobStorage } from "../infrastructure/blob-storage";
import {
  verifiedLetterRepository,
  type CreateVerifiedLetterInput,
} from "../infrastructure/verified-letter.repository";
import { SecretariatError } from "../domain/secretariat.errors";

const QR_WIDTH = 256;
const QR_SIZE_PX = 240;
const QR_BOTTOM_MARGIN_PX = 48;
const QR_CAPTION = "VERIFIKASI KEASLIAN";

export function generateVerificationCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(12);
  let code = "";
  for (const byte of bytes) {
    code += alphabet[byte % alphabet.length];
  }
  return code;
}

export function getVerificationUrl(code: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/verifikasi/surat/${code}`;
}

export async function renderQrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: "png",
    width: QR_WIDTH,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}

export async function embedQrIntoPdf(
  pdfBuffer: Buffer,
  qrPng: Buffer,
): Promise<Buffer> {
  const doc = await PDFDocument.load(pdfBuffer);
  const pngImage = await doc.embedPng(qrPng);
  const pages = doc.getPages();
  const page = pages[0];

  const { width: pageWidth } = page.getSize();
  const qrSize = Math.min(QR_SIZE_PX, pageWidth * 0.28);
  const x = (pageWidth - qrSize) / 2;
  const y = QR_BOTTOM_MARGIN_PX;

  page.drawImage(pngImage, { x, y, width: qrSize, height: qrSize });
  page.drawText(QR_CAPTION, {
    x: (pageWidth - QR_CAPTION.length * 3.2) / 2,
    y: QR_BOTTOM_MARGIN_PX + qrSize + 8,
    size: 7,
    color: rgb(0.35, 0.35, 0.35),
  });

  return Buffer.from(await doc.save());
}

export async function embedQrIntoImage(
  imageBuffer: Buffer,
  qrPng: Buffer,
  mimeType: string,
): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const { width, height } = await image.metadata();

  const qrSize = Math.min(QR_SIZE_PX, Math.round((width ?? 1000) * 0.28));
  const left = Math.round(((width ?? 1000) - qrSize) / 2);
  const top = Math.max(0, (height ?? 1000) - qrSize - QR_BOTTOM_MARGIN_PX);

  const composited = image
    .composite([
      {
        input: qrPng,
        left,
        top,
      },
    ]);

  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return composited.jpeg({ quality: 90 }).toBuffer();
  }
  return composited.png().toBuffer();
}

export function isPdfMime(mimeType: string): boolean {
  return mimeType === "application/pdf" || mimeType.endsWith("/pdf");
}

export function isImageMime(mimeType: string): boolean {
  return ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
    mimeType,
  );
}

export function isProcessableMime(mimeType: string): boolean {
  return isPdfMime(mimeType) || isImageMime(mimeType);
}

const MIME_DOC = "application/msword";
const MIME_DOCX =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export class UnsupportedFileTypeError extends SecretariatError {
  constructor() {
    super(
      "File harus berupa PDF, gambar (PNG/JPG/WebP), atau dokumen Word (.doc/.docx).",
    );
    this.name = "UnsupportedFileTypeError";
  }
}

function hasMagic(buffer: Buffer, magic: number[]): boolean {
  if (buffer.length < magic.length) return false;
  for (let i = 0; i < magic.length; i++) {
    if (buffer[i] !== magic[i]) return false;
  }
  return true;
}

export function detectFileMime(buffer: Buffer): string | null {
  if (hasMagic(buffer, [0x25, 0x50, 0x44, 0x46])) return "application/pdf";
  if (hasMagic(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return "image/png";
  if (hasMagic(buffer, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("latin1") === "RIFF" &&
    buffer.subarray(8, 12).toString("latin1") === "WEBP"
  )
    return "image/webp";
  if (hasMagic(buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
    return MIME_DOC;
  if (hasMagic(buffer, [0x50, 0x4b, 0x03, 0x04])) return MIME_DOCX;
  return null;
}

export function resolveUploadMimeType(
  fileBuffer: Buffer,
  fileName: string,
  declaredMimeType: string,
): string {
  const detected = detectFileMime(fileBuffer);
  if (detected === MIME_DOCX) {
    const ext = fileName.toLowerCase().split(".").pop() ?? "";
    const declared = declaredMimeType.toLowerCase();
    const docxDeclared = declared === MIME_DOCX || declared.includes("word");
    if (docxDeclared || ext === "docx") return MIME_DOCX;
    throw new UnsupportedFileTypeError();
  }
  if (detected) return detected;
  throw new UnsupportedFileTypeError();
}

export interface VerifiedLetterArtifacts {
  originalFileUrl: string;
  processedPdfUrl: string;
  qrPngUrl: string;
}

export async function processAndUploadLetter(
  folderKey: string,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  verificationCode: string,
): Promise<VerifiedLetterArtifacts> {
  const base = `verified-letters/${folderKey}`;
  const qrUrl = getVerificationUrl(verificationCode);
  const qrPng = await renderQrPng(qrUrl);

  const originalDest = `${base}/original/${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const qrDest = `${base}/qr.png`;

  const uploaded: string[] = [];
  try {
    const originalFileUrl = await blobStorage.upload(
      fileBuffer,
      originalDest,
      mimeType,
    );
    uploaded.push(originalFileUrl);

    const qrPngUrl = await blobStorage.upload(qrPng, qrDest, "image/png");
    uploaded.push(qrPngUrl);

    let processedPdfUrl = originalFileUrl;
    let processedDest = originalDest;
    if (isPdfMime(mimeType)) {
      const processed = await embedQrIntoPdf(fileBuffer, qrPng);
      processedDest = `${base}/processed.pdf`;
      processedPdfUrl = await blobStorage.upload(
        processed,
        processedDest,
        "application/pdf",
      );
      uploaded.push(processedPdfUrl);
    } else if (isImageMime(mimeType)) {
      const processed = await embedQrIntoImage(fileBuffer, qrPng, mimeType);
      const ext = mimeType.includes("jpeg") ? "jpg" : "png";
      processedDest = `${base}/processed.${ext}`;
      processedPdfUrl = await blobStorage.upload(
        processed,
        processedDest,
        mimeType.includes("jpeg") ? "image/jpeg" : "image/png",
      );
      uploaded.push(processedPdfUrl);
    }

    return {
      originalFileUrl,
      processedPdfUrl,
      qrPngUrl,
    };
  } catch (error) {
    await Promise.allSettled(
      uploaded.map((url) => blobStorage.delete(url)),
    );
    throw error;
  }
}

export interface CreateVerifiedLetterParams {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  letterType: string;
  registrationNumber: string;
  subject: string;
  date: Date;
  issuer: string | null;
}

export async function createVerifiedLetter(
  params: CreateVerifiedLetterParams,
) {
  const verificationCode = generateVerificationCode();
  const mimeType = resolveUploadMimeType(
    params.fileBuffer,
    params.fileName,
    params.mimeType,
  );

  const artifacts = await processAndUploadLetter(
    verificationCode,
    params.fileBuffer,
    params.fileName,
    mimeType,
    verificationCode,
  );

  const record: CreateVerifiedLetterInput = {
    letterType: params.letterType,
    registrationNumber: params.registrationNumber,
    subject: params.subject,
    date: params.date,
    issuer: params.issuer,
    originalFileUrl: artifacts.originalFileUrl,
    processedPdfUrl: artifacts.processedPdfUrl,
    qrPngUrl: artifacts.qrPngUrl,
    fileName: params.fileName,
    mimeType: params.mimeType,
    verificationCode,
  };

  try {
    return await verifiedLetterRepository.create(record);
  } catch (error) {
    await Promise.allSettled([
      blobStorage.delete(artifacts.originalFileUrl),
      blobStorage.delete(artifacts.processedPdfUrl),
      blobStorage.delete(artifacts.qrPngUrl),
    ]);
    throw error;
  }
}

export async function deleteVerifiedLetter(id: string) {
  const record = await verifiedLetterRepository.findById(id);
  if (!record) return;

  await verifiedLetterRepository.delete(id);

  await Promise.allSettled([
    blobStorage.delete(record.originalFileUrl),
    blobStorage.delete(record.processedPdfUrl),
    blobStorage.delete(record.qrPngUrl),
  ]);
}
