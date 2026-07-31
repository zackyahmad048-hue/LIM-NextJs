import { imsakiyahRepository } from "../infrastructure/repository";

export async function getAllImsakiyah() {
  return imsakiyahRepository.findAll();
}

export async function getImsakiyahByYear(year: number) {
  return imsakiyahRepository.findByYear(year);
}

export async function getImsakiyahCount() {
  return imsakiyahRepository.count();
}
