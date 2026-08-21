import type { ProgramStatus } from "@/generated/client";
import type { ProgramRepository } from "../domain/repository";
import { programRepository as repo } from "../infrastructure/repository";
import {
  ProgramCodeExistsError,
  ProgramNotFoundError,
  ParticipantAlreadyRegisteredError,
  InvalidStatusTransitionError,
  ProgramNotOnGoingError,
} from "../domain/program.errors";

const VALID_TRANSITIONS: Record<ProgramStatus, ProgramStatus[]> = {
  DRAFT: ["PUBLISHED", "CANCELLED"],
  PUBLISHED: ["REGISTRATION_OPEN", "ON_GOING", "CANCELLED"],
  REGISTRATION_OPEN: ["REGISTRATION_CLOSED", "ON_GOING", "CANCELLED"],
  REGISTRATION_CLOSED: ["ON_GOING", "CANCELLED"],
  ON_GOING: ["COMPLETED", "CANCELLED"],
  COMPLETED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: [],
};

function canTransition(from: ProgramStatus, to: ProgramStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export const programService = {
  async list(params: {
    search?: string;
    status?: ProgramStatus;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    return repo.findMany({
      search: params.search,
      status: params.status,
      type: params.type,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getById(id: string) {
    const program = await repo.findById(id);
    if (!program) throw new ProgramNotFoundError(id);
    return program;
  },

  async create(
    data: Omit<
      Parameters<ProgramRepository["create"]>[0],
      "status" | "organizerId"
    >,
  ) {
    const existing = await repo.findByCode(data.code);
    if (existing) throw new ProgramCodeExistsError(data.code);
    return repo.create({ ...data, status: "DRAFT", organizerId: null });
  },

  async update(id: string, data: Parameters<ProgramRepository["update"]>[1]) {
    const program = await repo.findById(id);
    if (!program) throw new ProgramNotFoundError(id);

    if (data.code && data.code !== program.code) {
      const existing = await repo.findByCode(data.code);
      if (existing) throw new ProgramCodeExistsError(data.code);
    }

    return repo.update(id, data);
  },

  async delete(id: string) {
    const program = await repo.findById(id);
    if (!program) throw new ProgramNotFoundError(id);
    await repo.softDelete(id);
  },

  async transitionStatus(id: string, newStatus: ProgramStatus) {
    const program = await repo.findById(id);
    if (!program) throw new ProgramNotFoundError(id);

    if (!canTransition(program.status, newStatus)) {
      throw new InvalidStatusTransitionError(program.status, newStatus);
    }

    return repo.update(id, { status: newStatus });
  },

  async getSchedules(programId: string) {
    return repo.getSchedules(programId);
  },

  async createSchedule(
    programId: string,
    data: Omit<Parameters<ProgramRepository["createSchedule"]>[0], "programId">,
  ) {
    return repo.createSchedule({ ...data, programId });
  },

  async updateSchedule(
    id: string,
    data: Parameters<ProgramRepository["updateSchedule"]>[1],
  ) {
    return repo.updateSchedule(id, data);
  },

  async deleteSchedule(id: string) {
    return repo.deleteSchedule(id);
  },

  async getCommittees(programId: string) {
    return repo.getCommittees(programId);
  },

  async assignCommittee(
    programId: string,
    data: { userId: string; role: string },
  ) {
    return repo.assignCommittee({ ...data, programId, status: "ACTIVE" });
  },

  async removeCommittee(id: string) {
    return repo.removeCommittee(id);
  },

  async getParticipants(programId: string) {
    return repo.getParticipants(programId);
  },

  async registerParticipant(programId: string, userId: string) {
    const participants = await repo.getParticipants(programId);
    const exists = participants.find((p) => p.userId === userId);
    if (exists) throw new ParticipantAlreadyRegisteredError();
    return repo.registerParticipant({
      programId,
      userId,
      registrationStatus: "PENDING",
    });
  },

  async updateParticipant(
    id: string,
    data: {
      registrationStatus?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    },
  ) {
    return repo.updateParticipant(id, data);
  },

  async removeParticipant(id: string) {
    return repo.removeParticipant(id);
  },

  async getAttendance(programId: string) {
    return repo.getAttendance(programId);
  },

  async checkIn(participantId: string, programId: string) {
    const program = await repo.findById(programId);
    if (!program || program.status !== "ON_GOING")
      throw new ProgramNotOnGoingError();
    return repo.checkIn(participantId);
  },

  async checkOut(participantId: string, programId: string) {
    const program = await repo.findById(programId);
    if (!program || program.status !== "ON_GOING")
      throw new ProgramNotOnGoingError();
    return repo.checkOut(participantId);
  },

  async getDocumentation(programId: string) {
    return repo.getDocumentation(programId);
  },

  async addDocumentation(
    programId: string,
    data: { mediaId: string; title: string; description?: string },
  ) {
    return repo.addDocumentation({
      ...data,
      programId,
      description: data.description ?? null,
    });
  },

  async removeDocumentation(id: string) {
    return repo.removeDocumentation(id);
  },

  async getDashboardStats() {
    return repo.getDashboardStats();
  },

  async getUpcomingPrograms(limit = 5) {
    return repo.getUpcomingPrograms(limit);
  },
};
