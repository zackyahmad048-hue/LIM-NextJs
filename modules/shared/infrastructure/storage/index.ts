import { VercelBlobStorage } from "./vercel-blob.storage";
import { GoogleDriveStorage } from "./google-drive.storage";
import type { FileStorage } from "./types";

export type { FileStorage } from "./types";

export const storage: FileStorage = new VercelBlobStorage();

export const driveStorage: FileStorage = new GoogleDriveStorage();
