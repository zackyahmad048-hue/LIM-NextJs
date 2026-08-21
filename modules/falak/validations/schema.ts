import { z } from "zod";

export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90, "Latitude harus antara -90 dan 90."),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude harus antara -180 dan 180."),
});

export const prayerTimeQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  date: z.coerce.date().optional(),
  method: z
    .enum([
      "KEMENAG",
      "MUHAMMADIYAH",
      "UMMAH_AL_QURA",
      "EGYPTIAN",
      "ISNA",
      "MWL",
    ])
    .default("KEMENAG"),
});

export const qiblaQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export const hijriQuerySchema = z.object({
  date: z.coerce.date().optional(),
  method: z
    .enum(["HISAB", "RUKYAT", "IMKANUR_RUKYAT", "WUJUDUL_HILAL"])
    .default("HISAB"),
});

export const hisabInputSchema = z.object({
  calculationDate: z.coerce.date(),
  locationName: z.string().min(1, "Nama lokasi wajib diisi."),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  parameters: z.record(z.string(), z.unknown()),
  result: z.record(z.string(), z.unknown()),
});

export const rukyatInputSchema = z.object({
  observationDate: z.coerce.date(),
  locationName: z.string().min(1, "Nama lokasi wajib diisi."),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  weather: z.string().min(1, "Cuaca wajib diisi."),
  result: z.enum(["VISIBLE", "NOT_VISIBLE", "CLOUDY", "UNKNOWN"]),
  notes: z.string().optional(),
});

export const eclipseInputSchema = z.object({
  eclipseType: z.enum(["SOLAR", "LUNAR"]),
  eclipseDate: z.coerce.date(),
  visibility: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type PrayerTimeQuery = z.infer<typeof prayerTimeQuerySchema>;
export type QiblaQuery = z.infer<typeof qiblaQuerySchema>;
export type HijriQuery = z.infer<typeof hijriQuerySchema>;
export type HisabInput = z.infer<typeof hisabInputSchema>;
export type RukyatInput = z.infer<typeof rukyatInputSchema>;
export type EclipseInput = z.infer<typeof eclipseInputSchema>;
