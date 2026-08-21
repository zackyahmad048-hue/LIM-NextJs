import { BaseRepository } from "@/modules/shared/infrastructure/base.repository";
import type { SettingRepository } from "../domain/setting.repository";
import { Setting } from "../domain/setting.entity";

export class PrismaSettingRepository
  extends BaseRepository
  implements SettingRepository
{
  async findByKey(key: string): Promise<Setting | null> {
    const setting = await this.db.setting.findUnique({ where: { key } });
    if (!setting) return null;

    return Setting.create({
      id: setting.id,
      key: setting.key,
      value: setting.value,
      type: setting.type,
      description: setting.description,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    });
  }

  async upsertValue(data: {
    key: string;
    value: string;
    type: string;
    description?: string;
  }): Promise<Setting> {
    const setting = await this.db.setting.upsert({
      where: { key: data.key },
      create: {
        key: data.key,
        value: data.value,
        type: data.type as "STRING" | "NUMBER" | "BOOLEAN" | "JSON",
        description: data.description,
      },
      update: {
        value: data.value,
        type: data.type as "STRING" | "NUMBER" | "BOOLEAN" | "JSON",
        description: data.description,
      },
    });

    return Setting.create({
      id: setting.id,
      key: setting.key,
      value: setting.value,
      type: setting.type,
      description: setting.description,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    });
  }
}
