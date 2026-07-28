"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const METHOD_LABELS: Record<string, string> = {
  KEMENAG: "Kemenag RI",
  MUHAMMADIYAH: "Muhammadiyah",
  ISNA: "ISNA",
  MWL: "Muslim World League",
};

const PRAYER_NAMES: Record<string, string> = {
  fajr: "Subuh",
  sunrise: "Terbit",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

export function PrayerTimeTable() {
  const [method, setMethod] = useState("KEMENAG");
  const [prayerTimes, setPrayerTimes] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    async function fetchPrayerTimes() {
      setLoading(true);
      try {
        const coords = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });

        const { latitude, longitude } = coords.coords;
        setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        const res = await fetch(
          `/api/v1/falak/prayer-times?latitude=${latitude}&longitude=${longitude}&method=${method}`
        );
        const json = await res.json();

        if (json.success && json.data) {
          setPrayerTimes({
            fajr: json.data.fajr,
            sunrise: json.data.sunrise,
            dhuhr: json.data.dhuhr,
            asr: json.data.asr,
            maghrib: json.data.maghrib,
            isha: json.data.isha,
          });
        }
      } catch {
        // Fallback: use Jakarta coordinates
        try {
          const res = await fetch(
            `/api/v1/falak/prayer-times?latitude=-6.2088&longitude=106.8456&method=${method}`
          );
          const json = await res.json();
          if (json.success && json.data) {
            setLocationName("Jakarta (default)");
            setPrayerTimes({
              fajr: json.data.fajr,
              sunrise: json.data.sunrise,
              dhuhr: json.data.dhuhr,
              asr: json.data.asr,
              maghrib: json.data.maghrib,
              isha: json.data.isha,
            });
          }
        } catch {
          setPrayerTimes(null);
        }
      }
      setLoading(false);
    }

    fetchPrayerTimes();
  }, [method]);

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Jadwal Shalat Hari Ini
          </CardTitle>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-45">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(METHOD_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {locationName && (
          <Badge variant="outline" className="w-fit">{locationName}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Memuat jadwal shalat...</div>
        ) : prayerTimes ? (
          <div className="space-y-3">
            {Object.entries(PRAYER_NAMES).map(([key, name]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <span className="font-medium text-foreground">{name}</span>
                <span className="font-mono text-lg font-semibold text-primary">
                  {formatTime(prayerTimes[key])}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Gagal memuat jadwal shalat. Pastikan lokasi diizinkan.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
