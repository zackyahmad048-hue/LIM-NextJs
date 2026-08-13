import type {
  WajibKhidmahLembagaCreateInput,
  WajibKhidmahLembagaEntity,
} from "./entities";

export interface LembagaRepository {
  findMany(params: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ items: WajibKhidmahLembagaEntity[]; total: number }>;

  findById(id: string): Promise<WajibKhidmahLembagaEntity | null>;

  create(
    data: WajibKhidmahLembagaCreateInput,
  ): Promise<WajibKhidmahLembagaEntity>;
}
