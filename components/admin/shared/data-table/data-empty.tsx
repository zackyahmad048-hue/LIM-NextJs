import { Inbox } from "lucide-react";

export function DataEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="mb-4 h-12 w-12 text-muted-foreground" />

      <h3 className="font-semibold">Belum ada data</h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Tambahkan data pertama untuk memulai.
      </p>
    </div>
  );
}
