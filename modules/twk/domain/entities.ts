export interface WajibKhidmahMemberEntity {
  id: string;
  nama: string;
  alamat: string | null;
  kelas: string | null;
  posWajibKhidmah: string | null;
  tempatWajibKhidmah: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WajibKhidmahMemberCreateInput {
  nama: string;
  alamat?: string | null;
  kelas?: string | null;
  posWajibKhidmah?: string | null;
  tempatWajibKhidmah?: string | null;
}

export interface WajibKhidmahMemberUpdateInput {
  nama?: string;
  alamat?: string | null;
  kelas?: string | null;
  posWajibKhidmah?: string | null;
  tempatWajibKhidmah?: string | null;
}
