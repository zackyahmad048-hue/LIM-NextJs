import type { ProgramStatus, RegistrationStatus } from "@/generated/client";
import type {
  ProgramEntity,
  ProgramScheduleEntity,
  ProgramCommitteeEntity,
  ParticipantEntity,
  AttendanceEntity,
  ProgramDocumentationEntity,
} from "./entities";

export interface ProgramRepository {
  findMany(params: {
    search?: string;
    status?: ProgramStatus;
    type?: string;
    page: number;
    limit: number;
  }): Promise<{ items: ProgramEntity[]; total: number }>;

  findById(id: string): Promise<ProgramEntity | null>;

  findByCode(code: string): Promise<ProgramEntity | null>;

  create(
    data: Omit<ProgramEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ): Promise<ProgramEntity>;

  update(
    id: string,
    data: Partial<
      Omit<ProgramEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ): Promise<ProgramEntity>;

  softDelete(id: string): Promise<void>;

  // Schedules
  getSchedules(programId: string): Promise<ProgramScheduleEntity[]>;

  createSchedule(
    data: Omit<ProgramScheduleEntity, "id">,
  ): Promise<ProgramScheduleEntity>;

  updateSchedule(
    id: string,
    data: Partial<Omit<ProgramScheduleEntity, "id">>,
  ): Promise<ProgramScheduleEntity>;

  deleteSchedule(id: string): Promise<void>;

  // Committees
  getCommittees(
    programId: string,
  ): Promise<
    (ProgramCommitteeEntity & { user: { name: string; email: string } })[]
  >;

  assignCommittee(
    data: Omit<ProgramCommitteeEntity, "id">,
  ): Promise<ProgramCommitteeEntity>;

  removeCommittee(id: string): Promise<void>;

  // Participants
  getParticipants(
    programId: string,
  ): Promise<(ParticipantEntity & { user: { name: string; email: string } })[]>;

  registerParticipant(
    data: Omit<ParticipantEntity, "id" | "registrationDate">,
  ): Promise<ParticipantEntity>;

  updateParticipant(
    id: string,
    data: { registrationStatus?: RegistrationStatus },
  ): Promise<ParticipantEntity>;

  removeParticipant(id: string): Promise<void>;

  // Attendance
  getAttendance(
    programId: string,
  ): Promise<
    (AttendanceEntity & { participant: { user: { name: string } } })[]
  >;

  checkIn(participantId: string): Promise<AttendanceEntity>;

  checkOut(participantId: string): Promise<AttendanceEntity>;

  // Documentation
  getDocumentation(programId: string): Promise<ProgramDocumentationEntity[]>;

  addDocumentation(
    data: Omit<ProgramDocumentationEntity, "id">,
  ): Promise<ProgramDocumentationEntity>;

  removeDocumentation(id: string): Promise<void>;

  // Dashboard
  getDashboardStats(): Promise<{
    total: number;
    draft: number;
    published: number;
    registrationOpen: number;
    onGoing: number;
    completed: number;
  }>;

  getUpcomingPrograms(limit: number): Promise<ProgramEntity[]>;
}
