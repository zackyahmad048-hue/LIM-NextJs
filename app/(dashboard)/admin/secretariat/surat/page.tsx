import { SuratPageClient } from "./surat-client";
import { getIncomingMails, getOutgoingMails } from "@/modules/secretariat/queries/secretariat.query";

export default async function SuratPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const tab = (params.tab === "keluar" ? "keluar" : "masuk") as "masuk" | "keluar";
  const search = params.search ?? "";
  const page = params.page ? Number(params.page) : 1;

  const [masuk, keluar] = await Promise.all([
    getIncomingMails({ search, page, limit: 20 }),
    getOutgoingMails({ search, page, limit: 20 }),
  ]);

  return (
    <SuratPageClient
      initialTab={tab}
      masukItems={masuk.items}
      masukTotal={masuk.total}
      keluarItems={keluar.items}
      keluarTotal={keluar.total}
      search={search}
    />
  );
}
