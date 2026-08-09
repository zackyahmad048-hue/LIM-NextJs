import { twkRepository as repo } from "../infrastructure/repository";
import type {
  WajibKhidmahMemberEntity,
  WajibKhidmahMemberUpdateInput,
  WajibKhidmahStatus,
} from "../domain/entities";
import { DEACTIVATED_STATUSES } from "../domain/entities";
import { MemberNotFoundError } from "../domain/twk.errors";
import type {
  WajibKhidmahMemberInput,
} from "../validations/schema";

function normalizeOptional(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

function normalizePos(value: string | null | undefined): string | null {
  const normalized = normalizeOptional(value);
  if (!normalized) return null;
  return normalized;
}

function normalizeCreate(data: WajibKhidmahMemberInput) {
  return {
    nama: data.nama,
    asalDaerah: normalizeOptional(data.asalDaerah),
    alamatLembaga: normalizeOptional(data.alamatLembaga),
    posWajibKhidmah: normalizePos(data.posWajibKhidmah),
    tempatWajibKhidmah: normalizeOptional(data.tempatWajibKhidmah),
    tugasKhidmah: normalizeOptional(data.tugasKhidmah),
    status: data.status ?? "AKTIF",
    keterangan: normalizeOptional(data.keterangan) ?? "-",
    catatan: normalizeOptional(data.catatan),
    absensi: normalizeOptional(data.absensi),
  };
}

function normalizeUpdate(
  data: Partial<WajibKhidmahMemberInput>,
): WajibKhidmahMemberUpdateInput {
  const output: WajibKhidmahMemberUpdateInput = {};

  if (data.nama !== undefined) output.nama = data.nama;
  if (data.asalDaerah !== undefined)
    output.asalDaerah = normalizeOptional(data.asalDaerah);
  if (data.alamatLembaga !== undefined)
    output.alamatLembaga = normalizeOptional(data.alamatLembaga);
  if (data.posWajibKhidmah !== undefined)
    output.posWajibKhidmah = normalizePos(data.posWajibKhidmah);
  if (data.tempatWajibKhidmah !== undefined)
    output.tempatWajibKhidmah = normalizeOptional(data.tempatWajibKhidmah);
  if (data.tugasKhidmah !== undefined)
    output.tugasKhidmah = normalizeOptional(data.tugasKhidmah);
  if (data.status !== undefined) output.status = data.status;
  if (data.keterangan !== undefined)
    output.keterangan = normalizeOptional(data.keterangan) ?? "-";
  if (data.catatan !== undefined)
    output.catatan = normalizeOptional(data.catatan);
  if (data.absensi !== undefined)
    output.absensi = normalizeOptional(data.absensi);

  return output;
}

export const twkService = {
  async listMembers(params: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return repo.findMany({
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async findAllMembers(): Promise<WajibKhidmahMemberEntity[]> {
    return repo.findAll();
  },

  async findMemberById(id: string): Promise<WajibKhidmahMemberEntity | null> {
    return repo.findById(id);
  },

  async create(data: WajibKhidmahMemberInput) {
    return repo.create(normalizeCreate(data));
  },

  async createMany(data: WajibKhidmahMemberInput[]): Promise<number> {
    if (data.length === 0) return 0;
    return repo.createMany(data.map(normalizeCreate));
  },

  async update(id: string, data: Partial<WajibKhidmahMemberInput>) {
    const existing = await repo.findById(id);
    if (!existing) throw new MemberNotFoundError(id);

    return repo.update(id, normalizeUpdate(data));
  },

  async deactivate(
    id: string,
    targetStatus: WajibKhidmahStatus,
    reason: string,
  ): Promise<WajibKhidmahMemberEntity> {
    if (!DEACTIVATED_STATUSES.includes(targetStatus as (typeof DEACTIVATED_STATUSES)[number])) {
      throw new Error(
        `Status non-aktif harus salah satu dari: ${DEACTIVATED_STATUSES.join(", ")}.`,
      );
    }
    const trimmedReason = reason?.trim();
    if (!trimmedReason) {
      throw new Error("Alasan penonaktifan wajib diisi.");
    }

    const existing = await repo.findById(id);
    if (!existing) throw new MemberNotFoundError(id);

    return repo.update(id, {
      status: targetStatus,
      keterangan: trimmedReason,
    });
  },

  async reactivate(id: string): Promise<WajibKhidmahMemberEntity> {
    const existing = await repo.findById(id);
    if (!existing) throw new MemberNotFoundError(id);

    return repo.update(id, {
      status: "AKTIF",
      keterangan: "-",
    });
  },

  async delete(id: string): Promise<void> {
    const existing = await repo.findById(id);
    if (!existing) throw new MemberNotFoundError(id);

    await repo.delete(id);
  },
};
