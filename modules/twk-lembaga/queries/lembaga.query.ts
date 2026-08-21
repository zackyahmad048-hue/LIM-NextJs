import { lembagaService } from "../application/lembaga.service";

export async function listLembaga(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return lembagaService.listLembaga(params);
}

export async function getLembagaById(id: string) {
  return lembagaService.findById(id);
}
