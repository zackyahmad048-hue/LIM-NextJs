import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { OfficersTable } from "@/components/admin/secretariat/officers-table";

import {
  getOfficers,
  getUnitById,
} from "@/modules/organization";

export const dynamic = "force-dynamic";

export default async function OfficersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [unit, officers] = await Promise.all([
    getUnitById(id),
    getOfficers(id),
  ]);

  if (!unit) notFound();

  return (
    <PageContainer>
      <PageHeader
        title={`Pengurus — ${unit.code}`}
        description={unit.name}
        actions={
          <Button asChild size="sm">
            <Link href={`/admin/secretariat/pendataan/officers/new?unitId=${unit.id}`}>
              <Plus className="size-4" />
              Pengurus Baru
            </Link>
          </Button>
        }
      />

      <Band
        title="Pengurus"
        description={`${officers.length} pengurus terdata pada ${unit.code}.`}
      >
        <OfficersTable data={officers} />
      </Band>
    </PageContainer>
  );
}
