export type MediaType = "FOTO" | "VIDEO" | "INFOGRAFIS";

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  FOTO: "Foto",
  VIDEO: "Video",
  INFOGRAFIS: "Infografis",
};

export const IGNORED_MEDIA_FILES = new Set(["logo.png", "orangelim.png"]);

export function humanizeFileName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}