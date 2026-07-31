import type { ObservationStatus } from "@/generated/client";
import { falakRukyatRepository } from "../infrastructure/repository";

export async function getRukyatByStatus(status: ObservationStatus, take = 50) {
  return falakRukyatRepository.findByStatus(status, take);
}

export async function getAllRukyat(take = 50) {
  return falakRukyatRepository.findAll(take);
}

export async function getRukyatById(id: string) {
  return falakRukyatRepository.findById(id);
}
