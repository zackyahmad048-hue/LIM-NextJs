import type { ProgramStatus, RegistrationStatus, CommitteeStatus, AttendanceStatus } from "@/generated/client";

export interface ProgramEntity {
  id: string;
  code: string;
  name: string;
  type: string;
  description: string | null;
  organizerId: string | null;
  personInChargeId: string | null;
  status: ProgramStatus;
  registrationOpen: Date | null;
  registrationClose: Date | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ProgramScheduleEntity {
  id: string;
  programId: string;
  title: string;
  venueId: string | null;
  startTime: Date;
  endTime: Date;
  description: string | null;
}

export interface ProgramCommitteeEntity {
  id: string;
  programId: string;
  userId: string;
  role: string;
  status: CommitteeStatus;
}

export interface ParticipantEntity {
  id: string;
  programId: string;
  userId: string;
  registrationDate: Date;
  registrationStatus: RegistrationStatus;
}

export interface AttendanceEntity {
  id: string;
  participantId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  status: AttendanceStatus;
}

export interface ProgramDocumentationEntity {
  id: string;
  programId: string;
  mediaId: string | null;
  title: string;
  description: string | null;
}