import type { SecretariatRepository } from "../domain/repository";
import { administrativeDocumentRepository } from "./administrative-document.repository";
import { agendaBookRepository } from "./agenda.repository";
import { documentArchiveRepository } from "./archive.repository";
import { dispositionRepository } from "./disposition.repository";
import { incomingMailRepository } from "./incoming-mail.repository";
import { outgoingMailRepository } from "./outgoing-mail.repository";
import { reportingRepository } from "./reporting.repository";

/**
 * Seluruh penyimpanan secretariat, dirangkai dari implementasi per agregat.
 */
export const secretariatRepository: SecretariatRepository = {
  ...incomingMailRepository,
  ...outgoingMailRepository,
  ...dispositionRepository,
  ...administrativeDocumentRepository,
  ...agendaBookRepository,
  ...documentArchiveRepository,
  ...reportingRepository,
};
