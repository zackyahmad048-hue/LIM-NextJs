import { secretariatRepository as repo } from "../infrastructure/repository";
import { administrativeDocumentService } from "./administrative-document.service";
import { agendaService } from "./agenda.service";
import { archiveService } from "./archive.service";
import { dispositionService } from "./disposition.service";
import { incomingMailService } from "./incoming-mail.service";
import { outgoingMailService } from "./outgoing-mail.service";

export {
  VALID_ADMINISTRATIVE_DOCUMENT_TRANSITIONS,
  VALID_DISPOSITION_TRANSITIONS,
  VALID_INCOMING_MAIL_TRANSITIONS,
  VALID_OUTGOING_MAIL_TRANSITIONS,
  canTransition,
} from "./status-transition";

/**
 * Fasad service secretariat. Perilaku tiap agregat berada di file sendiri,
 * sehingga satu perubahan hanya menyentuh satu agregat. Fasad ini menjaga
 * permukaan yang sudah dipakai lapisan aksi, lapisan baca, dan pagar
 * karakterisasi tetap utuh.
 */
export const secretariatService = {
  ...incomingMailService,
  ...outgoingMailService,
  ...dispositionService,
  ...administrativeDocumentService,
  ...agendaService,
  ...archiveService,

  // Baca dasbor belum punya agregat. Dipindahkan ke lapisan baca di tiket 07.
  async getDashboardStats() {
    return repo.getDashboardStats();
  },
};
