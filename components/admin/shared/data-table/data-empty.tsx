import { Inbox } from "lucide-react";

export function DataEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="mb-4 h-12 w-12 text-admin-content-fg/30" />

      <h3 className="font-semibold text-admin-content-fg">Belum ada data</h3>

      <p className="mt-2 text-sm text-admin-content-fg/60">
        Tambahkan data pertama untuk memulai.
      </p>
    </div>
  );
}
