import { readdir, stat } from "fs/promises";
import path from "path";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

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

export class MediaRepository {
  async findPublicImages() {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const files = await readdir(imagesDir);

    return Promise.all(
      files
        .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
        .map(async (file) => {
          const fileStat = await stat(path.join(imagesDir, file));

          return {
            name: file,
            href: `/images/${file}`,
            size: formatBytes(fileStat.size),
          };
        }),
    );
  }
}

export const mediaRepository = new MediaRepository();
