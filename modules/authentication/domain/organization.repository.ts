// modules/authentication/domain/organization.repository.ts
export interface OrganizationRepository {
  /** Nama unit organisasi milik akun organisasi, atau null bila akun belum terhubung ke unit. */
  findUnitNameByUserId(userId: string): Promise<string | null>
}
