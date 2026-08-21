import type {
  WajibKhidmahMemberCreateInput,
  WajibKhidmahMemberEntity,
  WajibKhidmahMemberUpdateInput,
} from "./entities";

export interface TwkRepository {
  findMany(params: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ items: WajibKhidmahMemberEntity[]; total: number }>;

  findAll(): Promise<WajibKhidmahMemberEntity[]>;

  findById(id: string): Promise<WajibKhidmahMemberEntity | null>;

  create(data: WajibKhidmahMemberCreateInput): Promise<WajibKhidmahMemberEntity>;

  createMany(data: WajibKhidmahMemberCreateInput[]): Promise<number>;

  update(
    id: string,
    data: WajibKhidmahMemberUpdateInput,
  ): Promise<WajibKhidmahMemberEntity>;

  delete(id: string): Promise<void>;
}
