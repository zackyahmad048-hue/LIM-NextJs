"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, MapPin } from "lucide-react";

export function QiblaCompass() {
  const [direction, setDirection] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculateQibla() {
    setLoading(true);
    setError("");
    try {
      const coords = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
          });
        },
      );

      const { latitude, longitude } = coords.coords;
      setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

      const res = await fetch(
        `/api/v1/falak/qibla?latitude=${latitude}&longitude=${longitude}`,
      );
      const json = await res.json();

      if (json.success && json.data) {
        setDirection(json.data.direction);
      } else {
        setError("Gagal menghitung arah kiblat.");
      }
    } catch {
      setError(
        "Tidak dapat mengakses lokasi. Izinkan akses lokasi di browser.",
      );
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          Arah Kiblat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {direction !== null ? (
          <>
            <div className="relative h-64 w-64">
              {/* Compass circle */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-primary" />

              {/* Kaaba icon at qibla direction */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ rotate: 0 }}
                animate={{ rotate: direction }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              >
                <div className="flex flex-col items-center">
                  <svg
                    viewBox="0 0 32 32"
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 8h16v16H8z" />
                    <path d="M8 8l4-4h16l-4 4z" opacity=".5" />
                    <path d="M24 4l4 4v16l-4-4z" opacity=".5" />
                    <path d="M8 14h16" strokeWidth="2" />
                  </svg>
                  <span className="mt-1 text-xs font-medium text-primary">
                    {direction.toFixed(1)}°
                  </span>
                </div>
              </motion.div>
            </div>

            {location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {location}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-dashed border-muted-foreground/20">
              <Compass className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Klik tombol di bawah untuk menentukan arah kiblat dari lokasi
              Anda.
            </p>
          </>
        )}

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <Button onClick={calculateQibla} disabled={loading}>
          {loading
            ? "Menghitung..."
            : direction !== null
              ? "Hitung Ulang"
              : "Tentukan Arah Kiblat"}
        </Button>
      </CardContent>
    </Card>
  );
}
