import { prisma } from "@/modules/shared/infrastructure/prisma";


export interface SettingUpsertInput {
  key: string;
  value: string;
  type: "STRING" | "NUMBER" | "BOOLEAN" | "JSON";
  description?: string | null;
}

export interface SettingEntity {
  id: string;
  key: string;
  value: string;
  type: "STRING" | "NUMBER" | "BOOLEAN" | "JSON";
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const settingService = {
  async findByKey(key: string) {
    const setting = await prisma.setting.findUnique({ where: { key } });
    return setting;
  },
  async upsertValue(data: SettingUpsertInput) {
    return await prisma.setting.upsert({
      where: { key: data.key },
      create: data as any,
      update: data as any,
    });
  },
};

function toEntity(s: any): SettingEntity {
  return {
    id: s.id,
    key: s.key,
    value: s.value,
    type: s.type as "STRING" | "NUMBER" | "BOOLEAN" | "JSON",
    description: s.description,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}
