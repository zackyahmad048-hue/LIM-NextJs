export interface FileStorage {
  save(buffer: Buffer, name: string, mimeType: string): Promise<string>;
  read(fileId: string): Promise<Buffer>;
  remove(fileId: string): Promise<void>;
}
