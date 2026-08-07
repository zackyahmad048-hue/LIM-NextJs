import { notFound } from "next/navigation";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import {
  getOfficerById,
  getOrganizationTree,
  getUnitById,
} from "@/modules/organization";
import { OfficerForm } from "../../../officer-form";

export const dynamic = "force-dynamic";

export default async function EditOfficerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const officer = await getOfficerById(id);

  if (!officer) notFound();

  const [tree, unit] = await Promise.all([
    getOrganizationTree(),
    getUnitById(officer.unitId),
  ]);

  const flatten = (
    nodes: typeof tree,
  ): { id: string; code: string; name: string }[] =>
    nodes.flatMap((node) => [
      { id: node.id, code: node.code, name: node.name },
      ...flatten(node.children),
    ]);

  return (
    <PageContainer>
      <PageHeader
        title={`Ubah Pengurus — ${officer.name}`}
        description={`${unit?.code ?? "-"} · ${officer.position}`}
      />

      <div className="mt-4">
        <OfficerForm
          units={flatten(tree)}
          mode="edit"
          id={officer.id}
          defaultUnitId={officer.unitId}
          initial={{
            name: officer.name,
            position: officer.position,
            isLeader: officer.isLeader,
            phone: officer.phone ?? "",
            email: officer.email ?? "",
            sortOrder: officer.sortOrder,
          }}
        />
      </div>
    </PageContainer>
  );
}
