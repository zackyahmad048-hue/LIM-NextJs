import { toHijri } from "hijri-converter";
import type { HijriDate } from "../../domain/types";



export function gregorianToHijri(date: Date): HijriDate {
  const result = toHijri(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  return { year: result.hy, month: result.hm, day: result.hd };
}

 
 
 