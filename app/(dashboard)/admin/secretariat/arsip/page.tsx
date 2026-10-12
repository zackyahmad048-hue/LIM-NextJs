import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

import { getArchiveData } from "@/modules/secretariat";
import {
  DocumentsArchiveTable,
  IncomingArchiveTable,
  OutgoingArchiveTable,
} from "./arsip-tables";

export const dynamic = "force-dynamic";

export default async function ArsipPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const { outgoing, incoming, documents } = await getArchiveData({
    search: params.search,
  });

  return (
    <PageContainer>
      <PageHeader
        title="Arsip"
        description="Kumpulan surat dan dokumen terarsip — hanya baca, diagregasi otomatis dari surat menyurat."
        actions={
          <form method="GET" className="flex items-center gap-2">
            <Input
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Cari perihal, nomor, atau pengirim..."
              className="rounded-md text-xs"
            />
            <Button type="submit" size="sm" variant="secondary">
              <Search className="size-3.5" /> Cari
            </Button>
          </form>
        }
      />

      <Band variant="plain" title="Surat Keluar Terarsip">
        {outgoing.length === 0 && (
          <p className="text-sm text-admin-content-fg/60">Belum ada surat keluar yang diarsipkan.</p>
        )}
        <OutgoingArchiveTable data={outgoing} />
      </Band>

      <Band variant="plain" title="Surat Masuk Terarsip">
        {incoming.length === 0 && (
          <p className="text-sm text-admin-content-fg/60">Belum ada surat masuk yang diarsipkan.</p>
        )}
        <IncomingArchiveTable data={incoming} />
      </Band>

      <Band variant="plain" title="Dokumen Administrasi Terarsip">
        {documents.length === 0 && (
          <p className="text-sm text-admin-content-fg/60">Belum ada dokumen administrasi terarsip.</p>
        )}
        <DocumentsArchiveTable data={documents} />
      </Band>
    </PageContainer>
  );
}