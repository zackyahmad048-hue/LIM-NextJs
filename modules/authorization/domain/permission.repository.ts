import { Permission } from "./permission.entity";

export interface PermissionRepository {
  findAll(): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>;
  findBySlug(slug: string): Promise<Permission | null>;
  create(data: { name: string; slug: string; description?: string }): Promise<Permission>;
}
