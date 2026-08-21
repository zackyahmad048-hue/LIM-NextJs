import type { HijriMethod } from "@/generated/client";
import { falakHijriCalendarRepository } from "../infrastructure/repository";

export async function getHijriCalendar(
  year: number,
  month: number,
  method: HijriMethod,
) {
  return falakHijriCalendarRepository.findByHijri(year, month, method);
}

export async function getHijriForDate(date: Date, method: HijriMethod) {
  return falakHijriCalendarRepository.findByGregorian(date, method);
}
