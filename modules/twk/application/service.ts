import type { WajibKhidmahMemberInput } from "../validations/schema";

export interface MemberForReport {
  nama: string;
  alamat?: string | null;
  kelas?: string | null;
  posWajibKhidmah?: string | null;
  tempatWajibKhidmah?: string | null;
}

export const LABEL_BELUM_DIISI = "Belum diisi";

export interface ReportStats {
  total: number;
  perKelas: Record<string, number>;
  perPos: Record<string, number>;
  perTempat: Record<string, number>;
}

type MemberField = "nama" | "alamat" | "kelas" | "posWajibKhidmah" | "tempatWajibKhidmah";

const HEADER_ALIASES: Record<string, MemberField> = {
  nama: "nama",
  name: "nama",
  alamat: "alamat",
  address: "alamat",
  kelas: "kelas",
  class: "kelas",
  poswajibkhidmah: "posWajibKhidmah",
  poswajib: "posWajibKhidmah",
  pos: "posWajibKhidmah",
  tempatwajibkhidmah: "tempatWajibKhidmah",
  tempatwajib: "tempatWajibKhidmah",
  tempat: "tempatWajibKhidmah",
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

    const alamat = read("alamat");
    const kelas = read("kelas");
    const posWajibKhidmah = read("posWajibKhidmah");
    const tempatWajibKhidmah = read("tempatWajibKhidmah");

    members.push({
      nama,
      ...(alamat ? { alamat } : {}),
      ...(kelas ? { kelas } : {}),
      ...(posWajibKhidmah ? { posWajibKhidmah } : {}),
      ...(tempatWajibKhidmah ? { tempatWajibKhidmah } : {}),
    });
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

export function buildReportStats(members: MemberForReport[]): ReportStats {
  return {
    total: members.length,
    perKelas: countBy(members, (m) => m.kelas),
    perPos: countBy(members, (m) => m.posWajibKhidmah),
    perTempat: countBy(members, (m) => m.tempatWajibKhidmah),
  };
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function toCsvExport(members: MemberForReport[]): string {
  const header = [
    "no",
    "nama",
    "alamat",
    "kelas",
    "posWajibKhidmah",
    "tempatWajibKhidmah",
  ]
    .map(csvCell)
    .join(",");

  const rows = members.map((member, index) =>
    [
      String(index + 1),
      member.nama,
      member.alamat ?? "",
      member.kelas ?? "",
      member.posWajibKhidmah ?? "",
      member.tempatWajibKhidmah ?? "",
    ]
      .map(csvCell)
      .join(","),
  );

  return [header, ...rows].join("\n");
}
