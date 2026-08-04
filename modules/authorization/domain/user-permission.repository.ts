export interface UserPermissionSlugs {
  roleSlugs: string[];
  permissionSlugs: string[];
}

export interface UserPermissionRepository {
  findSlugsByUserId(userId: string): Promise<UserPermissionSlugs>;
}
