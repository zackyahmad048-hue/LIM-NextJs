import { lembagaRepository as repo } from "../infrastructure/repository";
import type { WajibKhidmahLembagaEntity } from "../domain/entities";
import type { WajibKhidmahLembagaInput } from "../validations/schema";
import {
  toEnum,
  toGuruBantuCount,
  toNumberOrNull,
} from "../validations/schema";

function normalizeOptional(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

function normalizeArray<T extends string>(
  values: T[] | null | undefined,
): T[] {
  if (!values) return [];
  return values
    .map((value) => value.trim() as T)
    .filter((value) => value.length > 0);
}

function normalizeCreate(data: WajibKhidmahLembagaInput) {
  return {
    namaLembagaPendidikan: data.namaLembagaPendidikan,
    rtRw: normalizeOptional(data.rtRw),
    desaKelurahan: normalizeOptional(data.desaKelurahan),
    kecamatan: normalizeOptional(data.kecamatan),
    kabupatenKota: normalizeOptional(data.kabupatenKota),
    provinsi: normalizeOptional(data.provinsi),
    teleponLembaga: normalizeOptional(data.teleponLembaga),
    mediaSosialLembaga: normalizeOptional(data.mediaSosialLembaga),

    pengasuhNama: normalizeOptional(data.pengasuhNama),
    pengasuhStatus: toEnum(data.pengasuhStatus) ?? null,
    pengasuhStatusLainnya: normalizeOptional(data.pengasuhStatusLainnya),
    pengasuhAlumniAngkatan: normalizeOptional(data.pengasuhAlumniAngkatan),
    pengasuhTelepon: normalizeOptional(data.pengasuhTelepon),
    pengasuhFotoFileId: normalizeOptional(data.pengasuhFotoFileId),

    penanggungJawabNama: normalizeOptional(data.penanggungJawabNama),
    penanggungJawabStatus: toEnum(data.penanggungJawabStatus) ?? null,
    penanggungJawabStatusLainnya: normalizeOptional(
      data.penanggungJawabStatusLainnya,
    ),
    penanggungJawabAlumniAngkatan: normalizeOptional(
      data.penanggungJawabAlumniAngkatan,
    ),
    penanggungJawabTelepon: normalizeOptional(data.penanggungJawabTelepon),
    penanggungJawabFotoFileId: normalizeOptional(
      data.penanggungJawabFotoFileId,
    ),

    lokasiMadrasah: toEnum(data.lokasiMadrasah) ?? null,
    jenisSatuanPendidikan: normalizeArray(data.jenisSatuanPendidikan),
    jenisSatuanPendidikanLainnya: normalizeOptional(
      data.jenisSatuanPendidikanLainnya,
    ),
    kitabBermakna: normalizeArray(data.kitabBermakna),
    kitabBermaknaLainnya: normalizeOptional(data.kitabBermaknaLainnya),
    bahasaPengantar: normalizeArray(data.bahasaPengantar),
    bahasaPengantarLainnya: normalizeOptional(data.bahasaPengantarLainnya),
    jumlahPengurusPutra: toNumberOrNull(data.jumlahPengurusPutra) ?? null,
    jumlahPengurusPutri: toNumberOrNull(data.jumlahPengurusPutri) ?? null,
    jumlahSantriPutra: toNumberOrNull(data.jumlahSantriPutra) ?? null,
    jumlahSantriPutri: toNumberOrNull(data.jumlahSantriPutri) ?? null,

    jumlahGuruBantuDimohon: toGuruBantuCount(data.jumlahGuruBantuDimohon),
    tugasGuruBantu: normalizeOptional(data.tugasGuruBantu),
    kitabDiajarkanGuruBantu: normalizeOptional(data.kitabDiajarkanGuruBantu),
    catatanCalonGuruBantu: normalizeOptional(data.catatanCalonGuruBantu),
    dokumenPermohonanFileId: normalizeOptional(data.dokumenPermohonanFileId),
  };
}

export const lembagaService = {
  async listLembaga(params: {
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

  async findById(id: string): Promise<WajibKhidmahLembagaEntity | null> {
    return repo.findById(id);
  },

  async create(data: WajibKhidmahLembagaInput) {
    return repo.create(normalizeCreate(data));
  },
};
