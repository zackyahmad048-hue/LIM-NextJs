import { notFound } from "next/navigation";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import {
  getOrganizationTree,
  getUnitById,
} from "@/modules/organization";
import { UnitForm } from "../../../unit-form";

export const dynamic = "force-dynamic";

export default async function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [unit, tree] = await Promise.all([
    getUnitById(id),
    getOrganizationTree(),
  ]);

  if (!unit) notFound();

  const flatten = (
    nodes: typeof tree,
  ): { id: string; code: string; name: string; level: string }[] =>
    nodes.flatMap((node) => [
      { id: node.id, code: node.code, name: node.name, level: node.level },
      ...flatten(node.children),
    ]);

  return (
    <PageContainer>
      <PageHeader
        title={`Ubah Unit — ${unit.code}`}
        description={unit.name}
      />

      <div className="mt-4">
        <UnitForm
          units={(flatten(tree) as any).filter((u: any) => u.id !== unit.id)}
          mode="edit"
          id={unit.id}
          initial={{
            code: unit.code,
            name: unit.name,
            level: unit.level,
            parentId: unit.parentId,
            sortOrder: unit.sortOrder,
          }}
        />
      </div>
    </PageContainer>
  );
}
