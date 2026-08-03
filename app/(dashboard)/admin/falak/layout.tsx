import { redirect } from "next/navigation";

import { getCurrentUserPermissions } from "@/modules/authorization/queries/current-user-permission.query";
import { hasAnyPermission } from "@/modules/authorization/application/permission.service";
import { DEFAULT_PERMISSION_MATRIX } from "@/modules/authorization/application/permission.matrix";

export const dynamic = "force-dynamic";

export default async function FalakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { roleSlugs } = await getCurrentUserPermissions();

  if (
    !hasAnyPermission(
      roleSlugs,
      ["falak.prayer-time.view"],
      DEFAULT_PERMISSION_MATRIX,
    )
  ) {
    redirect("/admin");
  }

  return <>{children}</>;
}
