import { del, get, put } from "@vercel/blob";

import type { FileStorage } from "./types";

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export class VercelBlobStorage implements FileStorage {
  private token(): string {
    if (!BLOB_READ_WRITE_TOKEN) {
      throw new Error(
        "Penyimpanan file (Vercel Blob) belum dikonfigurasi. Set BLOB_READ_WRITE_TOKEN di .env.",
      );
    }
    return BLOB_READ_WRITE_TOKEN;
  }

  async save(buffer: Buffer, name: string, mimeType: string): Promise<string> {
    const pathname = name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const result = await put(pathname, buffer, {
      token: this.token(),
      access: "private",
      addRandomSuffix: true,
      contentType: mimeType,
    });
    return result.pathname;
  }

  async read(fileId: string): Promise<Buffer> {
    const result = await get(decodeURIComponent(fileId), {
      token: this.token(),
      access: "private",
    });
    if (!result || !result.stream) {
      throw new Error("File tidak ditemukan.");
    }
    const chunks: Uint8Array[] = [];
    const reader = result.stream.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  }

  async remove(fileId: string): Promise<void> {
    await del(decodeURIComponent(fileId), { token: this.token() });
  }
}
