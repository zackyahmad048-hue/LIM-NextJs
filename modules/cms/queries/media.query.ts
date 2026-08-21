import { MediaRepository } from "@/modules/media/infrastructure/media.repository";

const mediaRepo = new MediaRepository();

export function getPublicMediaItems() {
  return mediaRepo.findPublicImages();
}
