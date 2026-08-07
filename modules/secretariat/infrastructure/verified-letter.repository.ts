import type { VerifiedLetter } from "@/generated/client";

import { prisma } from "@/modules/shared/infrastructure/prisma";

export interface CreateVerifiedLetterInput {
  letterType: string;
  registrationNumber: string;
  subject: string;
  date: Date;
  issuer: string | null;
  originalFileUrl: string;
  processedPdfUrl: string;
  qrPngUrl: string;
  originalFileId: string | null;
  processedFileId: string | null;
  qrFileId: string | null;
  fileName: string;
  mimeType: string;
  verificationCode: string;
}

export class VerifiedLetterRepository {
  async create(data: CreateVerifiedLetterInput): Promise<VerifiedLetter> {
    return prisma.verifiedLetter.create({ data });
  }

  async findMany(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ items: VerifiedLetter[]; total: number }> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const search = params.search?.trim();

    const where = search
      ? {
          deletedAt: null,
          OR: [
            {
              registrationNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            { subject: { contains: search, mode: "insensitive" as const } },
            { letterType: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : { deletedAt: null };

    const [items, total] = await Promise.all([
      prisma.verifiedLetter.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.verifiedLetter.count({ where }),
    ]);

    return { items, total };
  }

  async findByCode(code: string): Promise<VerifiedLetter | null> {
    return prisma.verifiedLetter.findFirst({
      where: { verificationCode: code, deletedAt: null },
    });
  }

  async findById(id: string): Promise<VerifiedLetter | null> {
    return prisma.verifiedLetter.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async delete(id: string): Promise<VerifiedLetter> {
    return prisma.verifiedLetter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const verifiedLetterRepository = new VerifiedLetterRepository();
