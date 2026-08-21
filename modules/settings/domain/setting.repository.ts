import { Setting } from "./setting.entity";

export interface SettingRepository {
  findByKey(key: string): Promise<Setting | null>;
  upsertValue(data: {
    key: string;
    value: string;
    type: string;
    description?: string;
  }): Promise<Setting>;
}
