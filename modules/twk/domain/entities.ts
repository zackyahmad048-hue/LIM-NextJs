import type { WajibKhidmahStatus } from "@/generated/client";

export type { WajibKhidmahStatus };

export const POS_WAJIB_KHIDMAH = [
  "0. Asuhan Dzuriyah",
  "1. Pondok Induk",
  "2. Pondok Unit",
  "3. Pondok Cabang Zonasi",
  "4. Pondok Cabang non Zonasi",
  "5. MHM - Ma'had Aly",
  "6. Lembaga Pemohon",
  "7. TPQ - Madin",
  "8. Binaan LIM",
] as const;

export type PosWajibKhidmah = (typeof POS_WAJIB_KHIDMAH)[number];

export const DEACTIVATED_STATUSES = [
  "GUGUR",
  "BEBAS_TUGAS",
  "QODLO",
] as const satisfies readonly WajibKhidmahStatus[];

export const TUGAS_POS_ELIGIBLE = [
  "4. Pondok Cabang non Zonasi",
  "6. Lembaga Pemohon",
] as const;

export type TugasPos = (typeof TUGAS_POS_ELIGIBLE)[number];

export const WAJIB_KHIDMAH_STATUS_LABELS: Record<WajibKhidmahStatus, string> = {
  AKTIF: "Aktif",
  GUGUR: "Gugur",
  BEBAS_TUGAS: "Bebas Tugas",
  QODLO: "Qodlo",
};

export interface WajibKhidmahMemberEntity {
  id: string;
  nama: string;
  asalDaerah: string | null;
  alamatLembaga: string | null;
  posWajibKhidmah: string | null;
  tempatWajibKhidmah: string[];
  tugasKhidmah: string | null;
  status: WajibKhidmahStatus;
  keterangan: string | null;
  catatan: string | null;
  absensi: string | null;
  lembagaId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WajibKhidmahMemberCreateInput {
  nama: string;
  asalDaerah?: string | null;
  alamatLembaga?: string | null;
  posWajibKhidmah?: string | null;
  tempatWajibKhidmah?: string[];
  tugasKhidmah?: string | null;
  status?: WajibKhidmahStatus;
  keterangan?: string | null;
  catatan?: string | null;
  absensi?: string | null;
  lembagaId?: string | null;
}

export interface WajibKhidmahMemberUpdateInput {
  nama?: string;
  asalDaerah?: string | null;
  alamatLembaga?: string | null;
  posWajibKhidmah?: string | null;
  tempatWajibKhidmah?: string[];
  tugasKhidmah?: string | null;
  status?: WajibKhidmahStatus;
  keterangan?: string | null;
  catatan?: string | null;
  absensi?: string | null;
  lembagaId?: string | null;
}
