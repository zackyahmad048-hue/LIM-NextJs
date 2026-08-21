import { prisma } from "@/modules/shared/infrastructure/prisma";

export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  roles: { id: string; name: string; slug: string }[];
}

export async function getUsers(): Promise<UserWithRoles[]> {
  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          role: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    emailVerified: u.emailVerified,
    image: u.image,
    createdAt: u.createdAt,
    roles: u.userRoles.map((ur) => ur.role),
  }));
}
