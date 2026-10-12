import type { AgendaBookRepository } from "../domain/repository";
import { secretariatRepository } from "../infrastructure/repository";
import { EntityNotFoundError } from "../domain/secretariat.errors";

/** Penyimpanan agregat Buku Agenda — hanya operasi agregat ini. */
const repo: AgendaBookRepository = secretariatRepository;

/** Perilaku agregat Buku Agenda. */
export const agendaService = {
  async listAgendaBooks(params: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyAgendaBooks({
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getAgendaBookById(id: string) {
    const agenda = await repo.findAgendaBookById(id);
    if (!agenda) throw new EntityNotFoundError("Buku Agenda", id);
    return agenda;
  },

  async createAgendaBook(
    data: Parameters<AgendaBookRepository["createAgendaBook"]>[0],
  ) {
    return repo.createAgendaBook({ ...data, date: new Date(data.date) });
  },

  async updateAgendaBook(
    id: string,
    data: Parameters<AgendaBookRepository["updateAgendaBook"]>[1],
  ) {
    const agenda = await repo.findAgendaBookById(id);
    if (!agenda) throw new EntityNotFoundError("Buku Agenda", id);
    return repo.updateAgendaBook(id, {
      ...data,
      ...(data.date ? { date: new Date(data.date) } : {}),
    });
  },

  async deleteAgendaBook(id: string) {
    const agenda = await repo.findAgendaBookById(id);
    if (!agenda) throw new EntityNotFoundError("Buku Agenda", id);
    await repo.softDeleteAgendaBook(id);
  },

  async listAgendasInRange(params: { from: Date; to: Date }) {
    return repo.findAgendasInRange(params);
  },

  async listUpcomingAgendas(params: { from: Date; limit: number }) {
    return repo.findUpcomingAgendas(params);
  },
};
