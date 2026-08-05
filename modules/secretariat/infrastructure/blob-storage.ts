import { del, put } from "@vercel/blob";

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isBlobStorageConfigured(): boolean {
  return hasBlobToken();
}

export class BlobStorage {
  async upload(
    buffer: Buffer,
    destination: string,
    contentType: string,
  ): Promise<string> {
    if (!hasBlobToken()) {
      throw new Error(
        "Penyimpanan file belum dikonfigurasi. Set BLOB_READ_WRITE_TOKEN (lihat Vercel Blob) di .env.",
      );
    }
    const blob = await put(destination, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  async delete(url: string): Promise<void> {
    if (!hasBlobToken()) return;
    await del(url);
  }
}

export const blobStorage = new BlobStorage();
