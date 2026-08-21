"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  calculatePrayerTimes,
  convertToIstiwaClock,
  PrayerTimes,
  PrayerTimesNumeric,
} from "@/lib/astroCalc";
import { INDONESIA_CITIES } from "@/lib/cities";
import {
  Clock,
  Info,
  MapPin,
  Moon,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PRAYER_CARDS: Array<{
  key: keyof PrayerTimes;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    key: "fajr",
    label: "Subuh",
    icon: <Sunrise className="h-5 w-5 text-primary" />,
  },
  {
    key: "sunrise",
    label: "Terbit",
    icon: <Sun className="h-5 w-5 text-primary" />,
  },
  {
    key: "dhuhr",
    label: "Dzuhur",
    icon: <Sun className="h-5 w-5 text-primary" />,
  },
  {
    key: "asr",
    label: "Ashar",
    icon: <Sun className="h-5 w-5 text-primary" />,
  },
  {
    key: "maghrib",
    label: "Maghrib",
    icon: <Sunset className="h-5 w-5 text-primary" />,
  },
  {
    key: "isha",
    label: "Isya",
    icon: <Moon className="h-5 w-5 text-primary" />,
  },
];

export function PrayerTimeTable() {
  const {
    location,
    locationName,
    isGPS,
    errorMessage,
    requestGPSLocation,
    selectCity,
  } = useGeolocation();

  // Mode Toggle: false = Waktu Standar (WIB/WITA/WIT), true = Waktu Istiwa Hakiki
  const [isIstiwaMode, setIsIstiwaMode] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Custom Coordinate Inputs
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentTime) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <Clock className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-3">Memuat Perhitungan Waktu Shalat & Jam Istiwa...</p>
      </Card>
    );
  }

  // Calculate prayer schedule with 3 minutes Ihtiyath (waktu hati-hati)
  const ihtiyathMinutes = 3;
  const calculation = calculatePrayerTimes(
    currentTime,
    location,
    isIstiwaMode,
    ihtiyathMinutes,
  );
  const prayerTimesFormatted: PrayerTimes = calculation.timesFormatted;
  const prayerTimesNumeric: PrayerTimesNumeric = calculation.timesNumeric;

  // Convert live clock to Istiwa
  const istiwaClockInfo = convertToIstiwaClock(currentTime, location);

  // Live Standard Clock formatted
  const pad = (n: number) => n.toString().padStart(2, "0");
  const stdHours = pad(currentTime.getHours());
  const stdMinutes = pad(currentTime.getMinutes());
  const stdSeconds = pad(currentTime.getSeconds());
  const standardClockStr = `${stdHours}:${stdMinutes}:${stdSeconds}`;

  // Current active hour decimal representation
  const currentDecHours =
    currentTime.getHours() +
    currentTime.getMinutes() / 60 +
    currentTime.getSeconds() / 3600;

  let activeHourDec = currentDecHours;
  if (isIstiwaMode) {
    const transitStd = calculation.transitStandard;
    activeHourDec = (currentDecHours - transitStd + 12 + 24) % 24;
  }

  // Determine next prayer
  let nextPrayerName = "Subuh (Besok)";
  let nextPrayerTimeDec = prayerTimesNumeric.fajr;

  for (const p of PRAYER_CARDS) {
    if (p.key === "sunrise") continue;
    const timeNum = prayerTimesNumeric[p.key];
    if (timeNum > activeHourDec) {
      nextPrayerName = p.label;
      nextPrayerTimeDec = timeNum;
      break;
    }
  }

  let diffHours = nextPrayerTimeDec - activeHourDec;
  if (diffHours < 0) diffHours += 24;

  const countdownH = Math.floor(diffHours);
  const countdownM = Math.floor((diffHours - countdownH) * 60);
  const countdownS = Math.floor(
    ((diffHours - countdownH) * 60 - countdownM) * 60,
  );
  const countdownStr = `${pad(countdownH)}j ${pad(countdownM)}m ${pad(countdownS)}s`;

  const filteredCities = INDONESIA_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.province.toLowerCase().includes(citySearch.toLowerCase()),
  );

  const handleApplyCustomCoord = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon)) {
      let tz = 7;
      let tzName = "WIB";
      if (lon >= 127.5) {
        tz = 9;
        tzName = "WIT";
      } else if (lon >= 113.5) {
        tz = 8;
        tzName = "WITA";
      }

      selectCity({
        name:
          customName ||
          `Koordinat Custom (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        province: "Custom",
        latitude: lat,
        longitude: lon,
        timezone: tz,
        timezoneName: tzName,
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Location & City Picker */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">{locationName}</span>
          {isGPS ? (
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              GPS Device
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Manual / Kota Pilihan
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="gap-1 border-primary/30 text-primary"
          >
            <ShieldCheck className="h-3 w-3" />
            Ihtiyat +3 Menit
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={requestGPSLocation}
            className="gap-1.5"
          >
            <Navigation className="h-4 w-4 text-primary" />
            Lacak GPS Device
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Search className="h-4 w-4" />
                Input Kota Manual
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Pilih Lokasi Kota di Indonesia</DialogTitle>
              </DialogHeader>

              {/* Search Box */}
              <div className="space-y-4 pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama kota atau provinsi di Seluruh Indonesia..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                  {filteredCities.map((city) => (
                    <button
                      key={`${city.name}-${city.province}`}
                      onClick={() => {
                        selectCity(city);
                        setIsDialogOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                        city.name === locationName
                          ? "bg-accent font-semibold"
                          : "",
                      )}
                    >
                      <div>
                        <div className="font-medium text-foreground">
                          {city.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {city.province}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {city.timezoneName} (+{city.timezone})
                      </Badge>
                    </button>
                  ))}
                  {filteredCities.length === 0 && (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      Kota tidak ditemukan dalam daftar. Gunakan form koordinat
                      di bawah ini.
                    </div>
                  )}
                </div>

                {/* Custom Coordinate Form */}
                <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
                  <div className="text-xs font-semibold text-foreground">
                    Input Koordinat Manual (Kustom)
                  </div>
                  <form onSubmit={handleApplyCustomCoord} className="space-y-2">
                    <Input
                      placeholder="Nama Lokasi (misal: Pesantren Al-Falah)"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="text-xs h-8"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[10px] text-muted-foreground">
                          Latitude (Lintang)
                        </Label>
                        <Input
                          placeholder="-6.2088"
                          value={customLat}
                          onChange={(e) => setCustomLat(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">
                          Longitude (Bujur)
                        </Label>
                        <Input
                          placeholder="106.8456"
                          value={customLon}
                          onChange={(e) => setCustomLon(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="w-full text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Terapkan Koordinat Custom
                    </Button>
                  </form>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {/* Hero Live Clock & Istiwa Toggle Switch */}
      <Card className="border-border/10 bg-card shadow-[0_18px_40px_-20px] shadow-black/20">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3 rounded-full border border-border/10 bg-muted px-4 py-1.5">
            <span
              className={cn(
                "text-xs sm:text-sm font-medium transition-colors",
                !isIstiwaMode
                  ? "font-bold text-primary"
                  : "text-muted-foreground",
              )}
            >
              Waktu Standar ({location.timezoneName || "WIB"})
            </span>

            <Switch
              checked={isIstiwaMode}
              onCheckedChange={setIsIstiwaMode}
              aria-label="Toggle Waktu Istiwa Mode"
            />

            <span
              className={cn(
                "text-xs sm:text-sm font-medium transition-colors",
                isIstiwaMode
                  ? "font-bold text-amber-400"
                  : "text-muted-foreground",
              )}
            >
              Waktu Istiwa
            </span>
          </div>

          <CardTitle className="font-mono text-4xl sm:text-5xl font-extrabold text-balance text-foreground tabular-nums">
            {isIstiwaMode
              ? `${istiwaClockInfo.istiwaTimeStr} WIS`
              : `${standardClockStr} ${location.timezoneName || "WIB"}`}
          </CardTitle>
          <CardDescription className="pt-2 text-sm">
            Selisih:{" "}
            <Badge
              variant="outline"
              className="border-primary/40 text-primary"
            >
              {istiwaClockInfo.deltaStr}
            </Badge>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>
              Menuju <strong>{nextPrayerName}</strong> dalam:{" "}
              <strong className="font-mono font-bold tabular-nums">
                {countdownStr}
              </strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Prayer Schedule Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-balance text-foreground flex items-center gap-2">
            Jadwal Shalat (
            {isIstiwaMode
              ? "Waktu Istiwa"
              : location.timezoneName || "Waktu Standar"}
            )
          </h3>
          <span className="text-xs text-muted-foreground">
            {isIstiwaMode
              ? "Mode Istiwa (12:00 = Solar Noon)"
              : `Mode Standar (${location.timezoneName})`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRAYER_CARDS.map((p) => {
            const isNext = p.label === nextPrayerName;
            return (
              <Card
                key={p.key}
                className={cn(
                  "transition-[border-color,box-shadow,transform,scale] duration-200 hover:scale-[1.02]",
                  isNext
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                    : "border-border",
                )}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="mb-2 rounded-full bg-muted p-2">{p.icon}</div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {p.label}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-foreground tabular-nums">
                    {prayerTimesFormatted[p.key]}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground uppercase">
                    <span>
                      {isIstiwaMode ? "WIS" : location.timezoneName || "WIB"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Educational Explanation Box */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-primary" />
            Penjelasan Waktu Istiwa & Waktu Ihtiyat (+3 Menit)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-xs sm:text-sm text-muted-foreground sm:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <h4 className="font-semibold text-balance text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Waktu Ihtiyat (Hati-Hati)
            </h4>
            <p className="mt-1">
              Tambahan waktu pengaman sebesar <strong>+3 menit</strong>{" "}
              diterapkan pada waktu shalat (Subuh, Dzuhur, Ashar, Maghrib, Isya)
              sesuai kaidah hisab Kemenag RI & Fiqih Falak.
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <h4 className="font-semibold text-balance text-foreground">
              Kulminasi Matahari (Transit)
            </h4>
            <p className="mt-1">
              Jam 12:00:00 Istiwa tepat terjadi saat Matahari melintasi titik
              meridian lokal (Transit Solar Noon).
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <h4 className="font-semibold text-balance text-foreground">
              Selisih Bujur & EQT
            </h4>
            <p className="mt-1">
              Selisih saat ini adalah sekitar{" "}
              <strong className="text-foreground">
                {calculation.deltaMinutes.toFixed(1)} menit
              </strong>{" "}
              dibanding {location.timezoneName || "WIB"} akibat posisi bujur &
              perataan waktu.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
