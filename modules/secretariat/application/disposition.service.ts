import type { DispositionStatus } from "@/generated/client";

import type { SecretariatRepository } from "../domain/repository";
import { secretariatRepository as repo } from "../infrastructure/repository";
import {
  EntityNotFoundError,
  InvalidStatusTransitionError,
} from "../domain/secretariat.errors";
import {
  VALID_DISPOSITION_TRANSITIONS,
  canTransition,
} from "./status-transition";

/** Perilaku agregat Disposisi. Satu Surat Masuk dapat punya banyak Disposisi. */
export const dispositionService = {
  async listDispositions(params: {
    incomingMailId?: string;
    assignedToId?: string;
    status?: DispositionStatus;
    page?: number;
    limit?: number;
  }) {
    return repo.findManyDispositions({
      incomingMailId: params.incomingMailId,
      assignedToId: params.assignedToId,
      status: params.status,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    });
  },

  async getDispositionById(id: string) {
    const disposition = await repo.findDispositionById(id);
    if (!disposition) throw new EntityNotFoundError("Disposisi", id);
    return disposition;
  },

  async createDisposition(
    data: Omit<
      Parameters<SecretariatRepository["createDisposition"]>[0],
      "status"
    >,
  ) {
    const mail = await repo.findIncomingMailById(data.incomingMailId);
    if (!mail)
      throw new EntityNotFoundError("Surat Masuk", data.incomingMailId);
    return repo.createDisposition({ ...data, status: "PENDING" });
  },

  async updateDisposition(
    id: string,
    data: Parameters<SecretariatRepository["updateDisposition"]>[1],
  ) {
    const disposition = await repo.findDispositionById(id);
    if (!disposition) throw new EntityNotFoundError("Disposisi", id);
    return repo.updateDisposition(id, data);
  },

  async deleteDisposition(id: string) {
    const disposition = await repo.findDispositionById(id);
    if (!disposition) throw new EntityNotFoundError("Disposisi", id);
    await repo.deleteDisposition(id);
  },

  async transitionDispositionStatus(id: string, newStatus: DispositionStatus) {
    const disposition = await repo.findDispositionById(id);
    if (!disposition) throw new EntityNotFoundError("Disposisi", id);

    if (
      !canTransition(
        VALID_DISPOSITION_TRANSITIONS,
        disposition.status,
        newStatus,
      )
    ) {
      throw new InvalidStatusTransitionError(disposition.status, newStatus);
    }

    return repo.updateDisposition(id, { status: newStatus });
  },
};
