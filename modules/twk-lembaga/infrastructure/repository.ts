import type { WajibKhidmahLembagas } from "@/payload-types";

import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type {
  WajibKhidmahLembagaCreateInput,
  WajibKhidmahLembagaEntity,
} from "../domain/entities";
import type { LembagaRepository } from "../domain/repository";

const SEARCHABLE_FIELDS = [
  "namaLembagaPendidikan",
  "desaKelurahan",
  "kecamatan",
  "kabupatenKota",
  "provinsi",
  "pengasuhNama",
  "penanggungJawabNama",
] as const;

function mapLembaga(
  doc: WajibKhidmahLembagas,
): WajibKhidmahLembagaEntity {
  return {
    id: String(doc.id),
    namaLembagaPendidikan: doc.namaLembagaPendidikan,
    rtRw: doc.rtRw ?? null,
    desaKelurahan: doc.desaKelurahan ?? null,
    kecamatan: doc.kecamatan ?? null,
    kabupatenKota: doc.kabupatenKota ?? null,
    provinsi: doc.provinsi ?? null,
    teleponLembaga: doc.teleponLembaga ?? null,
    mediaSosialLembaga: doc.mediaSosialLembaga ?? null,

    pengasuhNama: doc.pengasuhNama ?? null,
    pengasuhStatus: doc.pengasuhStatus ?? null,
    pengasuhStatusLainnya: doc.pengasuhStatusLainnya ?? null,
    pengasuhAlumniAngkatan: doc.pengasuhAlumniAngkatan ?? null,
    pengasuhTelepon: doc.pengasuhTelepon ?? null,
    pengasuhFotoFileId: doc.pengasuhFotoFileId ?? null,

    penanggungJawabNama: doc.penanggungJawabNama ?? null,
    penanggungJawabStatus: doc.penanggungJawabStatus ?? null,
    penanggungJawabStatusLainnya: doc.penanggungJawabStatusLainnya ?? null,
    penanggungJawabAlumniAngkatan: doc.penanggungJawabAlumniAngkatan ?? null,
    penanggungJawabTelepon: doc.penanggungJawabTelepon ?? null,
    penanggungJawabFotoFileId: doc.penanggungJawabFotoFileId ?? null,

    lokasiMadrasah: doc.lokasiMadrasah ?? null,
    jenisSatuanPendidikan: doc.jenisSatuanPendidikan ?? [],
    jenisSatuanPendidikanLainnya: doc.jenisSatuanPendidikanLainnya ?? null,
    kitabBermakna:
      doc.kitabBermakna
        ?.map((k) => k.kitab ?? "")
        .filter((v) => v !== "") ?? [],
    kitabBermaknaLainnya: doc.kitabBermaknaLainnya ?? null,
    bahasaPengantar:
      doc.bahasaPengantar
        ?.map((b) => b.bahasa ?? "")
        .filter((v) => v !== "") ?? [],
    bahasaPengantarLainnya: doc.bahasaPengantarLainnya ?? null,
    jumlahPengurusPutra: doc.jumlahPengurusPutra ?? null,
    jumlahPengurusPutri: doc.jumlahPengurusPutri ?? null,
    jumlahSantriPutra: doc.jumlahSantriPutra ?? null,
    jumlahSantriPutri: doc.jumlahSantriPutri ?? null,

    jumlahGuruBantuDimohon: doc.jumlahGuruBantuDimohon,
    tugasGuruBantu: doc.tugasGuruBantu ?? null,
    kitabDiajarkanGuruBantu: doc.kitabDiajarkanGuruBantu ?? null,
    catatanCalonGuruBantu: doc.catatanCalonGuruBantu ?? null,
    dokumenPermohonanFileId: doc.dokumenPermohonanFileId ?? null,

    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

type LembagaPayloadBase = Omit<
  WajibKhidmahLembagas,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "kitabBermakna"
  | "bahasaPengantar"
> & {
  kitabBermakna?: { kitab?: string | null; id?: string | null }[] | null;
  bahasaPengantar?: { bahasa?: string | null; id?: string | null }[] | null;
};

function lembagaCreateData(
  data: WajibKhidmahLembagaCreateInput,
): LembagaPayloadBase {
  const { kitabBermakna, bahasaPengantar, ...rest } = data;
  const out: LembagaPayloadBase = { ...rest };
  if (kitabBermakna !== undefined) {
    out.kitabBermakna = kitabBermakna.map((v) => ({ kitab: v }));
  }
  if (bahasaPengantar !== undefined) {
    out.bahasaPengantar = bahasaPengantar.map((v) => ({ bahasa: v }));
  }
  return out;
}

export const lembagaRepository: LembagaRepository = {
  async findMany({ search, page, limit }) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "wajib-khidmah-lembagas",
      where: search
        ? {
            or: SEARCHABLE_FIELDS.map((field) => ({
              [field]: { like: search },
            })),
          }
        : undefined,
      sort: "-createdAt",
      page,
      limit,
      depth: 0,
    });
    return {
      items: res.docs.map(mapLembaga),
      total: res.totalDocs,
    };
  },

  async findById(id) {
    const payload = await getPayloadClient();
    try {
      const doc = await payload.findByID({
        collection: "wajib-khidmah-lembagas",
        id: Number(id),
        depth: 0,
      });
      return mapLembaga(doc);
    } catch {
      return null;
    }
  },

  async create(data: WajibKhidmahLembagaCreateInput) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "wajib-khidmah-lembagas",
      data: lembagaCreateData(data),
    });
    return mapLembaga(doc);
  },
};
