import { notFound } from "next/navigation";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getOrganizationTree } from "@/modules/organization";
import { OfficerForm } from "../../officer-form";

export const dynamic = "force-dynamic";

export default async function NewOfficerPage({
  searchParams,
}: {
  searchParams: Promise<{ unitId?: string }>;
}) {
  const { unitId } = await searchParams;
  const tree = await getOrganizationTree();

  const flatten = (
    nodes: typeof tree,
  ): { id: string; code: string; name: string }[] =>
    nodes.flatMap((node) => [
      { id: node.id, code: node.code, name: node.name },
      ...flatten(node.children),
    ]);

  const units = flatten(tree);
  if (units.length === 0) notFound();

  const defaultUnitId = unitId ?? units[0].id;

  return (
    <PageContainer>
      <PageHeader
        title="Pengurus Baru"
        description="Daftarkan pengurus pada unit kepengurusan."
      />

      <div className="mt-4">
        <OfficerForm units={units} mode="create" defaultUnitId={defaultUnitId} />
      </div>
    </PageContainer>
  );
}
