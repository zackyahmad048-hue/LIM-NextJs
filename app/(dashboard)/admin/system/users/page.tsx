import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getUsers } from "@/modules/authorization/queries/user.query";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <PageContainer>
      <PageHeader
        title="Pengguna"
        description="Daftar pengguna yang terdaftar di sistem."
      />

      <AdminTable
        title="Daftar Pengguna"
        description={`${users.length} pengguna terdaftar.`}
        columns={[
          {
            key: "pengguna",
            label: "Pengguna",
            render: (user) => (
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback className="text-xs bg-orange-100 text-orange-600">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
            ),
          },
          {
            key: "email",
            label: "Email",
            render: (user) => <span className="text-muted-foreground">{user.email}</span>,
          },
          {
            key: "role",
            label: "Role",
            render: (user) => (
              <div className="flex flex-wrap gap-1">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Badge key={role.id} variant="secondary" className="text-[11px]">
                      {role.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (user) => (
              <Badge variant={user.emailVerified ? "default" : "outline"} className="text-[11px]">
                {user.emailVerified ? "Terverifikasi" : "Belum"}
              </Badge>
            ),
          },
          {
            key: "bergabung",
            label: "Bergabung",
            render: (user) => (
              <span className="text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("id-ID")}
              </span>
            ),
          },
        ]}
        data={users}
        emptyMessage="Belum ada pengguna."
      />
    </PageContainer>
  );
}