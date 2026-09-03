import { readdir, stat } from "fs/promises";
import path from "path";
import type { MediaType } from "@/lib/media";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const videoExtensions = new Set([".mp4", ".webm", ".mov", ".m3u8"]);

const INFOGRAPHIC_FILE_PATTERN =
  /infograf(is|ik)?|poster|leaflet|katalog|banner/i;

function classifyFile(name: string): MediaType {
  const extension = path.extname(name).toLowerCase();

  if (videoExtensions.has(extension)) {
    return "VIDEO";
  }

  if (INFOGRAPHIC_FILE_PATTERN.test(name)) {
    return "INFOGRAFIS";
  }

  return "FOTO";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
}

async function listDirectory(
  dirName: "images" | "videos",
  extensions: Set<string>,
) {
  const dir = path.join(process.cwd(), "public", dirName);
  let files: string[];

  try {
    files = await readdir(dir);
  } catch {
    return [];
  }

  return Promise.all(
    files
      .filter(
        (file) => extensions.has(path.extname(file).toLowerCase().trim()),
      )
      .map(async (file) => {
        const fileStat = await stat(path.join(dir, file));

        return {
          name: file,
          href: `/${dirName}/${file}`,
          size: formatBytes(fileStat.size),
        };
      }),
  );
}

export class MediaRepository {
  async findPublicImages() {
    return listDirectory("images", imageExtensions);
  }

  async listPublicMedia() {
    const [images, videos] = await Promise.all([
      listDirectory("images", imageExtensions),
      listDirectory("videos", videoExtensions),
    ]);

    return [...images, ...videos]
      .map((item) => ({ ...item, type: classifyFile(item.name) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

export const mediaRepository = new MediaRepository();