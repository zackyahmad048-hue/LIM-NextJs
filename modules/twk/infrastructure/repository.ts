import type { WajibKhidmahMember } from "@/payload-types";

import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type {
  WajibKhidmahMemberCreateInput,
  WajibKhidmahMemberEntity,
  WajibKhidmahMemberUpdateInput,
} from "../domain/entities";
import type { TwkRepository } from "../domain/repository";

const SEARCHABLE_FIELDS = [
  "nama",
  "asalDaerah",
  "alamatLembaga",
  "posWajibKhidmah",
  "tugasKhidmah",
  "keterangan",
  "catatan",
  "absensi",
] as const;

function mapMember(doc: WajibKhidmahMember): WajibKhidmahMemberEntity {
  return {
    id: String(doc.id),
    nama: doc.nama,
    asalDaerah: doc.asalDaerah ?? null,
    alamatLembaga: doc.alamatLembaga ?? null,
    posWajibKhidmah: doc.posWajibKhidmah ?? null,
    tempatWajibKhidmah:
      doc.tempatWajibKhidmah
        ?.map((t) => t.tempat ?? "")
        .filter((v) => v !== "") ?? [],
    tugasKhidmah: doc.tugasKhidmah ?? null,
    status: doc.status,
    keterangan: doc.keterangan ?? null,
    catatan: doc.catatan ?? null,
    absensi: doc.absensi ?? null,
    lembagaId:
      doc.lembaga == null
        ? null
        : typeof doc.lembaga === "number"
          ? String(doc.lembaga)
          : String(doc.lembaga.id),
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

type MemberPayloadBase = Omit<
  WajibKhidmahMember,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "tempatWajibKhidmah"
  | "lembaga"
> & {
  tempatWajibKhidmah?: { tempat?: string | null; id?: string | null }[] | null;
  lembaga?: number | null;
};

type MemberCreatePayload = MemberPayloadBase & {
  status: WajibKhidmahMember["status"];
};

function memberCreateData(
  data: WajibKhidmahMemberCreateInput,
): MemberCreatePayload {
  const { tempatWajibKhidmah, lembagaId, ...rest } = data;
  const out: MemberCreatePayload = {
    ...rest,
    status: rest.status ?? "AKTIF",
  };
  if (tempatWajibKhidmah !== undefined) {
    out.tempatWajibKhidmah = tempatWajibKhidmah.map((v) => ({ tempat: v }));
  }
  if (lembagaId !== undefined) {
    const n = Number(lembagaId);
    out.lembaga =
      lembagaId != null && lembagaId !== "" && Number.isInteger(n)
        ? n
        : null;
  }
  return out;
}

function memberUpdateData(
  data: WajibKhidmahMemberUpdateInput,
): Partial<MemberPayloadBase> {
  const { tempatWajibKhidmah, lembagaId, ...rest } = data;
  const out: Partial<MemberPayloadBase> = { ...rest };
  if (tempatWajibKhidmah !== undefined) {
    out.tempatWajibKhidmah = tempatWajibKhidmah.map((v) => ({ tempat: v }));
  }
  if (lembagaId !== undefined) {
    const n = Number(lembagaId);
    out.lembaga =
      lembagaId != null && lembagaId !== "" && Number.isInteger(n)
        ? n
        : null;
  }
  return out;
}

export const twkRepository: TwkRepository = {
  async findMany({ search, page, limit }) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "wajib-khidmah-members",
      where: search
        ? {
            or: SEARCHABLE_FIELDS.map((field) => ({
              [field]: { like: search },
            })),
          }
        : undefined,
      sort: "createdAt",
      page,
      limit,
      depth: 0,
    });
    return {
      items: res.docs.map(mapMember),
      total: res.totalDocs,
    };
  },

  async findAll() {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "wajib-khidmah-members",
      sort: "createdAt",
      limit: 10000,
      depth: 0,
    });
    return res.docs.map(mapMember);
  },

  async findById(id) {
    const payload = await getPayloadClient();
    try {
      const doc = await payload.findByID({
        collection: "wajib-khidmah-members",
        id: Number(id),
        depth: 0,
      });
      return mapMember(doc);
    } catch {
      return null;
    }
  },

  async create(data: WajibKhidmahMemberCreateInput) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "wajib-khidmah-members",
      data: memberCreateData(data),
    });
    return mapMember(doc);
  },

  async createMany(data: WajibKhidmahMemberCreateInput[]) {
    const payload = await getPayloadClient();
    let count = 0;
    for (const item of data) {
      await payload.create({
        collection: "wajib-khidmah-members",
        data: memberCreateData(item),
      });
      count += 1;
    }
    return count;
  },

  async update(id: string, data: WajibKhidmahMemberUpdateInput) {
    const payload = await getPayloadClient();
    const doc = await payload.update({
      collection: "wajib-khidmah-members",
      id: Number(id),
      data: memberUpdateData(data),
    });
    return mapMember(doc);
  },

  async delete(id: string) {
    const payload = await getPayloadClient();
    await payload.delete({
      collection: "wajib-khidmah-members",
      id: Number(id),
    });
  },
};
