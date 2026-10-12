import { Prisma } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type {
  OutgoingMailEntity,
  QrPagePositionMm,
  QrPositionMm,
} from "../domain/entities";
import type { OutgoingMailRepository } from "../domain/repository";

/**
 * Kolom JSON Prisma tidak menerima `null` polos (harus sentinel) maupun interface
 * biasa. Konversi dilakukan di batas infrastruktur.
 */
function jsonOrDbNull(
  value: QrPagePositionMm | QrPositionMm | null | undefined,
): Prisma.InputJsonValue | typeof Prisma.DbNull | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.DbNull;
  return value as unknown as Prisma.InputJsonValue;
}

export const outgoingMailRepository: OutgoingMailRepository = {
  async findManyOutgoingMails({ search, status, page, limit }) {
    const where: Prisma.OutgoingMailWhereInput = { deletedAt: null };
    if (search)
      where.OR = [
        { subject: { contains: search } },
        { registrationNumber: { contains: search } },
        { recipient: { contains: search } },
      ];
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.outgoingMail.findMany({
        where,
        orderBy: { mailDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.outgoingMail.count({ where }),
    ]);

    return { items: items as unknown as OutgoingMailEntity[], total };
  },

  async findOutgoingMailById(id) {
    const item = await prisma.outgoingMail.findFirst({
      where: { id, deletedAt: null },
    });
    return item as OutgoingMailEntity | null;
  },

  async findOutgoingMailByNumber(registrationNumber) {
    const item = await prisma.outgoingMail.findUnique({
      where: { registrationNumber },
    });
    return item as OutgoingMailEntity | null;
  },

  async findOutgoingMailByVerificationCode(code) {
    const item = await prisma.outgoingMail.findFirst({
      where: {
        deletedAt: null,
        OR: [{ verificationCode: code }, { fullNumber: code }],
      },
    });
    return item as OutgoingMailEntity | null;
  },

  async createOutgoingMail(data) {
    const item = await prisma.outgoingMail.create({
      data: {
        ...data,
        qrKetuaPosition: jsonOrDbNull(data.qrKetuaPosition),
        qrSekretarisPosition: jsonOrDbNull(data.qrSekretarisPosition),
        qrVerifikasiPosition: jsonOrDbNull(data.qrVerifikasiPosition),
      },
    });
    return item as OutgoingMailEntity;
  },

  async updateOutgoingMail(id, data) {
    const item = await prisma.outgoingMail.update({
      where: { id },
      data: {
        ...data,
        qrKetuaPosition: jsonOrDbNull(data.qrKetuaPosition),
        qrSekretarisPosition: jsonOrDbNull(data.qrSekretarisPosition),
        qrVerifikasiPosition: jsonOrDbNull(data.qrVerifikasiPosition),
      },
    });
    return item as OutgoingMailEntity;
  },

  async softDeleteOutgoingMail(id) {
    await prisma.outgoingMail.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async findArchivedOutgoingMails({ search, limit = 100 }) {
    const where: Prisma.OutgoingMailWhereInput = {
      status: "ARCHIVED",
      deletedAt: null,
    };
    if (search)
      where.OR = [
        { subject: { contains: search } },
        { fullNumber: { contains: search } },
        { recipient: { contains: search } },
      ];

    const items = await prisma.outgoingMail.findMany({
      where,
      orderBy: { archivedAt: "desc" },
      take: limit,
    });
    return items as unknown as OutgoingMailEntity[];
  },

  async findRecentOutgoingMails(limit) {
    const items = await prisma.outgoingMail.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return items as unknown as OutgoingMailEntity[];
  },
};
