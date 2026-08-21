import { BaseRepository } from "@/modules/shared/infrastructure/base.repository";
import type { UserRepository } from "../domain/user.repository";
import { User } from "../domain/user.entity";

export class PrismaUserRepository
  extends BaseRepository
  implements UserRepository
{
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) return null;

    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) return null;

    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async countAll(): Promise<number> {
    return this.db.user.count();
  }

  async create(data: {
    name: string;
    email: string;
    emailVerified?: boolean;
  }): Promise<User> {
    const user = await this.db.user.create({
      data: {
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified ?? false,
      },
    });

    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
