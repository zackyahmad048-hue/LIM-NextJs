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
import { useGeolocation, getTimezoneFromLongitude } from "@/hooks/use-geolocation";
import {
  calculatePrayerTimes,
  convertToIstiwaClock,
  dateToDecimalHoursInZone,
  PrayerTimes,
  PrayerTimesNumeric,
} from "@/lib/astroCalc";
import { INDONESIA_CITIES } from "@/lib/cities";
import {
  Clock,
  Info,
  Loader2,
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
    status,
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
      <Card className="p-12 text-center text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <Clock className="h-12 w-12 animate-spin text-primary" />
          <p className="max-w-md text-lg">
            Memuat perhitungan waktu shalat & jam istiwa...
          </p>
          <p className="text-sm text-muted-foreground/80">
            Anggur waktu di langit, mengumpulkan cahaya untuk perjalanan spiritual harian Anda
          </p>
        </div>
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

  // Current active hour decimal representation, expressed in the active
  // location's timezone (not the device's) to match the prayer-time frame.
  const currentDecHours = dateToDecimalHoursInZone(currentTime, location.timezone);

  // Live Standard Clock formatted — shown in the active location's time, so
  // switching city/GPS updates the wall clock along with the zone label.
  const pad = (n: number) => n.toString().padStart(2, "0");
  const stdClockSeconds = Math.round(currentDecHours * 3600) % (24 * 3600);
  const stdHours = pad(Math.floor(stdClockSeconds / 3600));
  const stdMinutes = pad(Math.floor((stdClockSeconds % 3600) / 60));
  const stdSeconds = pad(stdClockSeconds % 60);
  const standardClockStr = `${stdHours}:${stdMinutes}:${stdSeconds}`;

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
      const { timezone: tz, timezoneName: tzName } =
        getTimezoneFromLongitude(lon);

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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/25 bg-card p-4">
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
            disabled={status === "loading"}
            className="gap-1.5"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Navigation className="h-4 w-4 text-primary" />
            )}
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
                    type="search"
                    aria-label="Cari kota atau provinsi"
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
                      aria-label="Nama lokasi kustom"
                      placeholder="Nama Lokasi (misal: Pesantren Al-Falah)"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="text-xs h-8"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label
                          htmlFor="custom-lat"
                          className="text-[10px] text-muted-foreground"
                        >
                          Latitude (Lintang)
                        </Label>
                        <Input
                          id="custom-lat"
                          inputMode="decimal"
                          placeholder="-6.2088"
                          value={customLat}
                          onChange={(e) => setCustomLat(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="custom-lon"
                          className="text-[10px] text-muted-foreground"
                        >
                          Longitude (Bujur)
                        </Label>
                        <Input
                          id="custom-lon"
                          inputMode="decimal"
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
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Lokasi tidak valid. Izinkan GPS atau pilih kota Indonesia.
          </span>
        </div>
      )}

      {/* Hero Live Clock & Istiwa Toggle Switch */}
      <Card className="relative border-border bg-card overflow-hidden">
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
        <CardHeader className="pb-2 text-center relative z-10 pt-6">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3 rounded-full border border-border/10 bg-muted px-4 py-1.5 shadow-sm">
            <span
              className={cn(
                "text-xs sm:text-sm font-semibold transition-colors",
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
              className="data-[state=checked]:bg-primary"
            />

            <span
              className={cn(
                "text-xs sm:text-sm font-semibold transition-colors",
                isIstiwaMode
                  ? "font-bold text-primary"
                  : "text-muted-foreground",
              )}
            >
              Waktu Istiwa
            </span>
          </div>

          <CardTitle className="font-heading text-5xl sm:text-6xl font-bold text-balance text-foreground">
            <span className="inline-flex items-baseline gap-2">
              <span className="text-primary">
                {isIstiwaMode ? `${istiwaClockInfo.istiwaTimeStr}` : `${standardClockStr}`}
              </span>
              <span className="text-muted-foreground/80 text-3xl">
                {isIstiwaMode ? "WIS" : location.timezoneName || "WIB"}
              </span>
            </span>
          </CardTitle>
          <CardDescription className="pt-3 text-base">
            <span className="text-muted-foreground">Selisih: </span>
            <Badge
              variant="outline"
              className="border-primary/60 text-primary font-semibold"
            >
              {istiwaClockInfo.deltaStr}
            </Badge>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-xs sm:text-sm text-primary">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-balance text-foreground flex items-center gap-2">
            <Sun className="h-6 w-6 text-primary" />
            Jadwal Shalat 
            <Badge variant="secondary" className="text-xs font-normal ml-2 border-primary/30 text-primary">
              {isIstiwaMode
                ? "Waktu Istiwa"
                : location.timezoneName || "Waktu Standar"}
            </Badge>
          </h2>
          <div className="hidden sm:block text-xs text-muted-foreground text-right">
            <span className="block">
              {isIstiwaMode
                ? "Mode Istiwa (12:00 = Solar Noon)"
                : `Mode Standar (${location.timezoneName})`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRAYER_CARDS.map((p) => {
            const isNext = p.label === nextPrayerName;
            return (
              <Card
                key={p.key}
                className={cn(
                  "relative transition-all duration-300 ease-out hover:-translate-y-1",
                  isNext
                    ? "border-primary/80 shadow-md"
                    : "border-border/80 hover:border-primary/50",
                  "overflow-hidden"
                )}
              >
                {isNext && (
                  <div className="absolute right-2 top-2">
                    <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                      Next
                    </Badge>
                  </div>
                )}
                <CardContent className="flex flex-col items-center justify-center p-5 text-center">
                  <div className={cn(
                    "mb-3 rounded-full p-3 transition-colors",
                    isNext
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>{p.icon}</div>
                  <div className={cn(
                    "text-sm font-semibold transition-colors",
                    isNext ? "text-primary" : "text-foreground"
                  )}>{p.label}</div>
                  <div className={cn(
                    "mt-2 font-mono text-2xl font-bold tabular-nums transition-colors",
                    isNext ? "text-primary" : "text-foreground"
                  )}>
                    {prayerTimesFormatted[p.key]}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <span className="uppercase">
                      {isIstiwaMode ? "WIS" : location.timezoneName || "WIB"}
                    </span>
                    {isNext && <span className="text-primary">•</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Educational Explanation Box */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="pb-2 bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-primary" />
            Penjelasan Waktu Istiwa & Waktu Ihtiyat (+3 Menit)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-xs sm:text-sm text-muted-foreground sm:grid-cols-3 p-6">
          <div className="group relative rounded-lg border border-border bg-background p-5 transition-all hover:shadow-md hover:border-primary/50">
            <div className="absolute -top-1 -right-1 rounded-full bg-primary/10 px-2 py-0.5">
              <span className="text-xs font-medium text-primary">01</span>
            </div>
            <h3 className="font-semibold text-balance text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Waktu Ihtiyat (Hati-Hati)
            </h3>
            <p className="mt-2">
              Tambahan waktu pengaman sebesar <strong className="text-primary">+3 menit</strong>{" "}
              diterapkan pada waktu shalat (Subuh, Dzuhur, Ashar, Maghrib, Isya)
              sesuai kaidah hisab Kemenag RI & Fiqih Falak.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Pengaman spiritual untuk ketepatan ritual
            </div>
          </div>
          <div className="group relative rounded-lg border border-border bg-background p-5 transition-all hover:shadow-md hover:border-primary/50">
            <div className="absolute -top-1 -right-1 rounded-full bg-primary/10 px-2 py-0.5">
              <span className="text-xs font-medium text-primary">02</span>
            </div>
            <h3 className="font-semibold text-balance text-foreground">
              Kulminasi Matahari (Transit)
            </h3>
            <p className="mt-2">
              Jam 12:00:00 Istiwa tepat terjadi saat Matahari melintasi titik
              meridian lokal (Transit Solar Noon).
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Sun className="h-3 w-3" />
              Titik tertinggi matahari, penanda waktu
            </div>
          </div>
          <div className="group relative rounded-lg border border-border bg-background p-5 transition-all hover:shadow-md hover:border-primary/50">
            <div className="absolute -top-1 -right-1 rounded-full bg-primary/10 px-2 py-0.5">
              <span className="text-xs font-medium text-primary">03</span>
            </div>
            <h3 className="font-semibold text-balance text-foreground">
              Selisih Bujur & EQT
            </h3>
            <p className="mt-2">
              Selisih saat ini adalah sekitar{" "}
              <strong className="text-primary">
                {calculation.deltaMinutes.toFixed(1)} menit
              </strong>{" "}
              dibanding {location.timezoneName || "WIB"} akibat posisi bujur &
              perataan waktu.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Navigation className="h-3 w-3" />
              Koreksi geografis untuk ketepatan
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
