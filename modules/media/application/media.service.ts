import { prisma } from "@/modules/shared/infrastructure/prisma";


export interface MediaEntity {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileId: string;
  access: "PUBLIC" | "PRIVATE";
  folder: string;
  storageProvider: "BLOB" | "GOOGLE_DRIVE";
}

export const mediaService = {
  async getById(id: string): Promise<MediaEntity | null> {
    const m = await prisma.media.findUnique({ where: { id } });
    return m ? toEntity(m) : null;
  },

  async listByFolder(folder: string): Promise<MediaEntity[]> {
    const list = await prisma.media.findMany({ where: { folder } });
    return list.map(toEntity);
  },

  async create(data: Omit<MediaEntity, "id">): Promise<MediaEntity> {
    const m = await prisma.media.create({ data: data as any });
    return toEntity(m);
  },

  async delete(id: string): Promise<void> {
    await prisma.media.delete({ where: { id } });
  },
};

function toEntity(m: any): MediaEntity {
  return {
    id: m.id,
    originalName: m.originalName,
    mimeType: m.mimeType,
    size: m.size,
    fileId: m.fileId,
    access: m.access as "PUBLIC" | "PRIVATE",
    folder: m.folder,
    storageProvider: m.storageProvider as "BLOB" | "GOOGLE_DRIVE",
  };
}
