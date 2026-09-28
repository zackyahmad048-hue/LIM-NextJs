import Link from "next/link";
import { getSession } from "@/modules/authentication/infrastructure/session.helper";
import { getCurrentUserPermissions } from "@/modules/authorization/queries/current-user-permission.query";
import { ROLE_LABELS } from "@/config/role";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const { roleSlugs } = await getCurrentUserPermissions();

  const user = {
    name: session?.user.name ?? "Admin",
    email: session?.user.email ?? "",
    image: session?.user.image ?? null,
    roleLabel:
      roleSlugs.map((slug) => ROLE_LABELS[slug]).filter(Boolean)[0] ?? "Admin",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Selamat datang, {user.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {user.email} &middot; {user.roleLabel}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin"
          className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <h3 className="font-semibold text-lg">Panel Admin (Payload CMS)</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola konten website, artikel, media, dan pengaturan.
          </p>
        </Link>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg">Profil Organisasi</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola visi, misi, sejarah, dan struktur organisasi LIM.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg">Layanan Falak</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola jadwal shalat, arah kiblat, kalender Hijriah, dan hisab.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg">Artikel & Media</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola artikel, galeri foto, dan video kegiatan.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg">Surat Menyurat</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola surat masuk, keluar, disposisi, dan arsip.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-lg">Pengguna & Peran</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola akun pengguna, peran, dan izin akses.
          </p>
        </div>
      </div>
    </div>
  );
}