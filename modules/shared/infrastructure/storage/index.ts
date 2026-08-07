import { VercelBlobStorage } from "./vercel-blob.storage";
import type { FileStorage } from "./types";

export type { FileStorage } from "./types";

export const storage: FileStorage = new VercelBlobStorage();
