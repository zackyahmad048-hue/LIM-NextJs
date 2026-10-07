import { z } from "zod";

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
