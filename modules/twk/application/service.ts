import type { WajibKhidmahStatus } from "../domain/entities";
import { POS_WAJIB_KHIDMAH } from "../domain/entities";
import type { WajibKhidmahMemberInput } from "../validations/schema";

export interface MemberForReport {
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
}

export const LABEL_BELUM_DIISI = "Belum diisi";

export interface ReportStats {
  total: number;
  perStatus: Record<string, number>;
  perPos: Record<string, number>;
  perTempat: Record<string, number>;
  perTugas: Record<string, number>;
}

type MemberField =
  | "nama"
  | "asalDaerah"
  | "alamatLembaga"
  | "posWajibKhidmah"
  | "tempatWajibKhidmah"
  | "tugasKhidmah"
  | "status"
  | "keterangan"
  | "catatan"
  | "absensi";

const HEADER_ALIASES: Record<string, MemberField> = {
  nama: "nama",
  name: "nama",
  asaldaerah: "asalDaerah",
  asal: "asalDaerah",
  daerah: "asalDaerah",
  alamatlembaga: "alamatLembaga",
  alamat: "alamatLembaga",
  lembaga: "alamatLembaga",
  poswajibkhidmah: "posWajibKhidmah",
  poswajib: "posWajibKhidmah",
  pos: "posWajibKhidmah",
  tempatwajibkhidmah: "tempatWajibKhidmah",
  tempatwajib: "tempatWajibKhidmah",
  tempat: "tempatWajibKhidmah",
  tugaskhidmah: "tugasKhidmah",
  tugas: "tugasKhidmah",
  status: "status",
  keterangan: "keterangan",
  catatan: "catatan",
  absensi: "absensi",
};

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[\s_\-().]/g, "");
}

function detectDelimiter(headerLine: string): "," | ";" {
  const semicolons = (headerLine.match(/;/g) ?? []).length;
  const commas = (headerLine.match(/,/g) ?? []).length;
  return semicolons > commas ? ";" : ",";
}

function splitCsvLine(line: string, delimiter: "," | ";"): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  cells.push(current);
  return cells;
}

const VALID_STATUSES: readonly WajibKhidmahStatus[] = [
  "AKTIF",
  "GUGUR",
  "BEBAS_TUGAS",
  "QODLO",
];

function normalizeStatus(raw: string): WajibKhidmahStatus {
  const normalized = raw.trim().toUpperCase().replace(/[\s-]/g, "_");
  if (VALID_STATUSES.includes(normalized as WajibKhidmahStatus)) {
    return normalized as WajibKhidmahStatus;
  }
  return "AKTIF";
}

export function parseCsv(csv: string): WajibKhidmahMemberInput[] {
  const text = csv.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!text) return [];

  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitCsvLine(lines[0], delimiter).map((h) =>
    normalizeHeader(h.trim()),
  );

  const columnIndex: Partial<Record<MemberField, number>> = {};
  headers.forEach((header, index) => {
    const field = HEADER_ALIASES[header];
    if (field && columnIndex[field] === undefined) columnIndex[field] = index;
  });

  if (columnIndex.nama === undefined) return [];

  const members: WajibKhidmahMemberInput[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i], delimiter);
    const read = (field: MemberField): string =>
      columnIndex[field] !== undefined
        ? (cells[columnIndex[field] as number] ?? "").trim()
        : "";

    const nama = read("nama");
    if (!nama) continue;

    const asalDaerah = read("asalDaerah");
    const alamatLembaga = read("alamatLembaga");
    const posWajibKhidmah = read("posWajibKhidmah");
    const tempatWajibKhidmah = read("tempatWajibKhidmah");
    const tugasKhidmah = read("tugasKhidmah");
    const statusRaw = read("status");
    const keterangan = read("keterangan");
    const catatan = read("catatan");
    const absensi = read("absensi");

    const member: WajibKhidmahMemberInput = {
      nama,
      status: normalizeStatus(statusRaw),
    };

    if (asalDaerah) member.asalDaerah = asalDaerah;
    if (alamatLembaga) member.alamatLembaga = alamatLembaga;
    if (posWajibKhidmah) {
      const posValues = POS_WAJIB_KHIDMAH as readonly string[];
      if (posValues.includes(posWajibKhidmah)) {
        member.posWajibKhidmah = posWajibKhidmah as (typeof POS_WAJIB_KHIDMAH)[number];
      }
    }
    if (tempatWajibKhidmah) {
      member.tempatWajibKhidmah = tempatWajibKhidmah
        .split(/[\n;|]/)
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
    }
    if (tugasKhidmah) member.tugasKhidmah = tugasKhidmah;
    if (keterangan) member.keterangan = keterangan;
    if (catatan) member.catatan = catatan;
    if (absensi) member.absensi = absensi;

    members.push(member);
  }

  return members;
}

function countBy(
  members: MemberForReport[],
  field: (member: MemberForReport) => string | null | undefined,
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const member of members) {
    const value = field(member)?.trim();
    const key = value ? value : LABEL_BELUM_DIISI;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}

function countByList(
  members: MemberForReport[],
  field: (member: MemberForReport) => string[] | null | undefined,
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const member of members) {
    const values = (field(member) ?? [])
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    if (values.length === 0) {
      counts[LABEL_BELUM_DIISI] = (counts[LABEL_BELUM_DIISI] ?? 0) + 1;
      continue;
    }
    for (const value of values) {
      counts[value] = (counts[value] ?? 0) + 1;
    }
  }

  return counts;
}

export function buildReportStats(members: MemberForReport[]): ReportStats {
  return {
    total: members.length,
    perStatus: countBy(members, (m) => m.status),
    perPos: countBy(members, (m) => m.posWajibKhidmah),
    perTempat: countByList(members, (m) => m.tempatWajibKhidmah),
    perTugas: countBy(members, (m) => m.tugasKhidmah),
  };
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function toCsvExport(members: MemberForReport[]): string {
  const header = [
    "no",
    "nama",
    "asalDaerah",
    "alamatLembaga",
    "posWajibKhidmah",
    "tempatWajibKhidmah",
    "tugasKhidmah",
    "status",
    "keterangan",
    "catatan",
    "absensi",
  ]
    .map(csvCell)
    .join(",");

  const rows = members.map((member, index) =>
    [
      String(index + 1),
      member.nama,
      member.asalDaerah ?? "",
      member.alamatLembaga ?? "",
      member.posWajibKhidmah ?? "",
      member.tempatWajibKhidmah?.join("; ") ?? "",
      member.tugasKhidmah ?? "",
      member.status ?? "",
      member.keterangan ?? "",
      member.catatan ?? "",
      member.absensi ?? "",
    ]
      .map(csvCell)
      .join(","),
  );

  return [header, ...rows].join("\n");
}
