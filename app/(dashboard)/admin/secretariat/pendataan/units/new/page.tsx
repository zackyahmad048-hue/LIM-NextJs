import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getOrganizationTree } from "@/modules/organization";
import { UnitForm } from "../../unit-form";

export const dynamic = "force-dynamic";

export default async function NewUnitPage() {
  const tree = await getOrganizationTree();

  const flatten = (
    nodes: typeof tree,
    depth: number,
  ): { id: string; code: string; name: string; level: string }[] =>
    nodes.flatMap((node) => [
      { id: node.id, code: node.code, name: node.name, level: node.level },
      ...flatten(node.children, depth + 1),
    ]);

  return (
    <PageContainer>
      <PageHeader
        title="Tambah Unit"
        description="Tambahkan unit kepengurusan baru ke struktur."
      />

      <div className="mt-4">
        <UnitForm units={flatten(tree, 0) as any} mode="create" />
      </div>
    </PageContainer>
  );
}
