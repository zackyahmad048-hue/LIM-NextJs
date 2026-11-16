// modules/falak/domain/falak.repository.ts
import type { FalakConfig, JadwalShalat } from '@/generated/client'

export interface FalakRepository {
  getActiveConfig(): Promise<FalakConfig | null>
  upsertJadwal(data: {
    tanggal: Date; subuh: string; terbit: string; dzuhur: string; ashar: string
    maghrib: string; isya: string; configId: string; isManualOverride?: boolean
  }): Promise<JadwalShalat>
  getJadwal(tanggal: Date): Promise<JadwalShalat | null>
}