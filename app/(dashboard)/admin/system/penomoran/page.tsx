import { redirect } from "next/navigation";
import { Cog } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

import { getLetterNumberingConfig } from "@/modules/secretariat/queries/secretariat.query";
import { getCurrentUserPermissions } from "@/modules/authorization/queries/current-user-permission.query";
import { NumberingSettingsForm } from "./numbering-settings-form";

export const dynamic = "force-dynamic";

export default async function PenomoranSettingsPage() {
  const [config, permissions] = await Promise.all([
    getLetterNumberingConfig(),
    getCurrentUserPermissions(),
  ]);

  if (!permissions.roleSlugs.includes("super-admin")) {
    redirect("/admin");
  }

  return (
    <PageContainer>
      <PageHeader
        title="Pengaturan Penomoran Surat"
        description="Khusus super admin — format, periode, dan kode tingkat untuk penomoran surat keluar."
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NumberingSettingsForm config={config} />
        </div>

        <Band className="h-fit">
          <div className="mb-3 flex items-center gap-2">
            <Cog className="size-4 text-admin-content-fg/50" />
            <h2 className="text-sm font-semibold text-admin-content-fg">
              Petunjuk Format
            </h2>
          </div>
          <ul className="space-y-2 text-xs text-admin-content-fg/60">
            <li>
              <code className="rounded bg-admin-input-bg px-1.5 py-0.5 font-mono">
                {"{seq}"}
              </code>{" "}
              — nomor urut (di-pad sesuai digit)
            </li>
            <li>
              <code className="rounded bg-admin-input-bg px-1.5 py-0.5 font-mono">
                {"{level}"}
              </code>{" "}
              — kode tingkat kepengurusan
            </li>
            <li>
              <code className="rounded bg-admin-input-bg px-1.5 py-0.5 font-mono">
                {"{category}"}
              </code>{" "}
              — kode kategori surat
            </li>
            <li>
              <code className="rounded bg-admin-input-bg px-1.5 py-0.5 font-mono">
                {"{bulan}"}
              </code>{" "}
              — bulan (angka Romawi)
            </li>
            <li>
              <code className="rounded bg-admin-input-bg px-1.5 py-0.5 font-mono">
                {"{tahun}"}
              </code>{" "}
              — tahun periode aktif
            </li>
          </ul>
        </Band>
      </div>
    </PageContainer>
  );
}