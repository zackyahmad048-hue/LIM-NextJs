import { Inbox } from "lucide-react";

interface DataEmptyProps {
  /** Pesan kustom menggantikan "Belum ada data". */
  message?: string;
  /** Deskripsi kustom menggantikan "Tambahkan data pertama untuk memulai.".
   *  Isi `""` untuk tabel read-only yang tidak punya aksi tambah. */
  description?: string;
  /** Aksi opsional (mis. Link ke halaman baru). */
  action?: React.ReactNode;
}

export function DataEmpty({ message, description, action }: DataEmptyProps) {
  const resolvedDescription =
    description ?? "Tambahkan data pertama untuk memulai.";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="mb-4 h-12 w-12 text-admin-content-fg/30" />

      <h2 className="font-semibold text-admin-content-fg">
        {message ?? "Belum ada data"}
      </h2>

      {resolvedDescription !== "" && (
        <p className="mt-2 text-sm text-admin-content-fg/60">
          {resolvedDescription}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
