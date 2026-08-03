import type { docs_v1 } from "googleapis";
import { getGoogleClients, mapGoogleError, withGoogleRetry } from "./client";
import { GoogleApiError } from "./errors";

export interface GoogleDocResult {
  id: string;
  url: string;
}

function collectText(
  elements: docs_v1.Schema$StructuralElement[] | undefined,
  out: string[] = [],
): string {
  for (const element of elements ?? []) {
    if (element.paragraph?.elements) {
      for (const elementChild of element.paragraph.elements) {
        if (elementChild.textRun?.content)
          out.push(elementChild.textRun.content);
      }
    }
    for (const tableRow of element.table?.tableRows ?? []) {
      for (const cell of tableRow.tableCells ?? []) {
        collectText(cell.content, out);
      }
    }
  }
  return out.join("");
}

export function extractPlaceholders(
  document: docs_v1.Schema$Document,
): string[] {
  const text = collectText(document.body?.content);
  const keys = new Set<string>();
  for (const match of text.matchAll(/\{\{([A-Za-z0-9_]+)\}\}/g)) {
    keys.add(match[1]);
  }
  return [...keys];
}

/**
 * Menyalin template Google Docs lalu mengganti placeholder `{{key}}` dengan nilai.
 * Placeholder yang nilainya kosong dibiarkan agar bisa dilengkapi manual.
 */
export async function createDocumentFromTemplate(
  templateId: string,
  values: Record<string, string>,
  name: string,
): Promise<GoogleDocResult> {
  const { drive, docs } = getGoogleClients();

  const copyRes = await withGoogleRetry(() =>
    drive.files.copy({
      fileId: templateId,
      requestBody: { name },
    }),
  );

  const documentId = copyRes.data.id;
  if (!documentId) {
    throw new GoogleApiError("UNKNOWN", "Gagal membuat dokumen dari template.");
  }

  const docRes = await withGoogleRetry(() =>
    docs.documents.get({ documentId }),
  );
  const requests: docs_v1.Schema$Request[] = [];

  for (const key of extractPlaceholders(docRes.data)) {
    const replaceText = values[key];
    if (replaceText === undefined || replaceText === "") continue;
    requests.push({
      replaceAllText: {
        containsText: { text: `{{${key}}}`, matchCase: true },
        replaceText,
      },
    });
  }

  if (requests.length > 0) {
    try {
      await withGoogleRetry(() =>
        docs.documents.batchUpdate({
          documentId,
          requestBody: { requests },
        }),
      );
    } catch (e) {
      const err = mapGoogleError(e);
      console.error("[google-doc] Gagal mengisi placeholder:", err.message);
    }
  }

  return {
    id: documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}
