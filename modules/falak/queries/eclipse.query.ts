import { falakEclipseRepository } from "../infrastructure/repository";

export async function getUpcomingEclipses() {
  return falakEclipseRepository.findUpcoming();
}

export async function getPastEclipses(take = 10) {
  return falakEclipseRepository.findPast(take);
}

