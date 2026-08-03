import { Role } from "./role.entity";

export interface RoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findBySlug(slug: string): Promise<Role | null>;
  create(data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Role>;
  update(
    id: string,
    data: Partial<{ name: string; slug: string; description: string }>,
  ): Promise<Role>;
  delete(id: string): Promise<void>;
}
