import { Inbox } from "lucide-react";

export function DataEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-lg m-4">
      <Inbox className="mb-4 h-12 w-12 text-muted-foreground/30" />

      <h2 className="font-semibold text-foreground">Belum ada data</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Tambahkan data pertama untuk memulai.
      </p>
    </div>
  );
}