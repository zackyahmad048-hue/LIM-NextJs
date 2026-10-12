import type { IncomingMailStatus } from "@/generated/client";

import type { SecretariatRepository } from "../domain/repository";
import { secretariatRepository as repo } from "../infrastructure/repository";
import {
  DuplicateNumberError,
  EntityNotFoundError,
  InvalidStatusTransitionError,
} from "../domain/secretariat.errors";
import {
  VALID_INCOMING_MAIL_TRANSITIONS,
  canTransition,
} from "./status-transition";

/** Perilaku agregat Surat Masuk. */
export const incomingMailService = {
  async listIncomingMails(params: {
    search?: string;
    status?: IncomingMailStatus;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyIncomingMails({
      search: params.search,
      status: params.status,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getIncomingMailById(id: string) {
    const mail = await repo.findIncomingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Masuk", id);
    return mail;
  },

  async createIncomingMail(
    data: Omit<
      Parameters<SecretariatRepository["createIncomingMail"]>[0],
      "status"
    >,
  ) {
    const existing = await repo.findIncomingMailByNumber(
      data.registrationNumber,
    );
    if (existing) throw new DuplicateNumberError(data.registrationNumber);
    return repo.createIncomingMail({
      ...data,
      status: "RECEIVED",
    });
  },

  async updateIncomingMail(
    id: string,
    data: Parameters<SecretariatRepository["updateIncomingMail"]>[1],
  ) {
    const mail = await repo.findIncomingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Masuk", id);

    if (
      data.registrationNumber &&
      data.registrationNumber !== mail.registrationNumber
    ) {
      const existing = await repo.findIncomingMailByNumber(
        data.registrationNumber,
      );
      if (existing) throw new DuplicateNumberError(data.registrationNumber);
    }

    return repo.updateIncomingMail(id, data);
  },

  async deleteIncomingMail(id: string) {
    const mail = await repo.findIncomingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Masuk", id);
    await repo.softDeleteIncomingMail(id);
  },

  async archiveIncomingMail(id: string) {
    const mail = await repo.findIncomingMailById(id);
    if (!mail) throw new EntityNotFoundError("Surat Masuk", id);

    if (
      !canTransition(VALID_INCOMING_MAIL_TRANSITIONS, mail.status, "ARCHIVED")
    ) {
      throw new InvalidStatusTransitionError(mail.status, "ARCHIVED");
    }

    return repo.updateIncomingMail(id, {
      status: "ARCHIVED",
      archivedAt: new Date(),
    });
  },

  async listArchivedIncomingMails(params: { search?: string; limit?: number }) {
    return repo.findArchivedIncomingMails({
      search: params.search,
      limit: params.limit,
    });
  },

  async listRecentIncomingMails(limit: number) {
    return repo.findRecentIncomingMails(limit);
  },

  async countIncomingMailsByMonth(year: number) {
    return repo.countIncomingMailsByMonth(year);
  },
};
