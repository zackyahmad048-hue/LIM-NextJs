import { SuratMenyuratClient } from "./surat-menyurat-client";
import {
  getDocumentArchives,
  getIncomingMails,
  getOutgoingMails,
  getVerifiedLetters,
} from "@/modules/secretariat/queries/secretariat.query";

export default async function SuratMenyuratPage() {
  const [verifiedLetters, outgoing, incoming, archives] = await Promise.all([
    getVerifiedLetters({ page: 1, limit: 50 }),
    getOutgoingMails({ page: 1, limit: 20 }),
    getIncomingMails({ page: 1, limit: 20 }),
    getDocumentArchives({ page: 1, limit: 20 }),
  ]);

  return (
    <SuratMenyuratClient
      verifiedLetters={verifiedLetters.items}
      verifiedTotal={verifiedLetters.total}
      outgoingItems={outgoing.items.map((item) => ({
        ...item,
        recipient: item.recipient ?? "",
      }))}
      outgoingTotal={outgoing.total}
      incomingItems={incoming.items}
      incomingTotal={incoming.total}
      archives={archives.items}
      archivesTotal={archives.total}
    />
  );
}
