import { twkRepository as repo } from "../infrastructure/repository";
import type {
  WajibKhidmahMemberEntity,
  WajibKhidmahMemberUpdateInput,
} from "../domain/entities";
import { MemberNotFoundError } from "../domain/twk.errors";
import type {
  WajibKhidmahMemberInput,
} from "../validations/schema";

function normalizeOptional(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeCreate(data: WajibKhidmahMemberInput) {
  return {
    nama: data.nama,
    alamat: normalizeOptional(data.alamat),
    kelas: normalizeOptional(data.kelas),
    posWajibKhidmah: normalizeOptional(data.posWajibKhidmah),
    tempatWajibKhidmah: normalizeOptional(data.tempatWajibKhidmah),
  };
}

function normalizeUpdate(
  data: Partial<WajibKhidmahMemberInput>,
): WajibKhidmahMemberUpdateInput {
  const output: WajibKhidmahMemberUpdateInput = {};

  if (data.nama !== undefined) output.nama = data.nama;
  if (data.alamat !== undefined) output.alamat = normalizeOptional(data.alamat);
  if (data.kelas !== undefined) output.kelas = normalizeOptional(data.kelas);
  if (data.posWajibKhidmah !== undefined)
    output.posWajibKhidmah = normalizeOptional(data.posWajibKhidmah);
  if (data.tempatWajibKhidmah !== undefined)
    output.tempatWajibKhidmah = normalizeOptional(data.tempatWajibKhidmah);

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

  async delete(id: string): Promise<void> {
    const existing = await repo.findById(id);
    if (!existing) throw new MemberNotFoundError(id);

    await repo.delete(id);
  },
};
