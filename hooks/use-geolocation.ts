import { useState, useCallback } from "react";
import { LocationInfo } from "@/lib/astroCalc";
import { DEFAULT_CITY, City } from "@/lib/cities";

export interface GeolocationState {
  location: LocationInfo;
  locationName: string;
  isGPS: boolean;
  status: "idle" | "loading" | "success" | "denied" | "error";
  errorMessage: string | null;
}

export function getTimezoneFromLongitude(longitude: number): {
  timezone: number;
  timezoneName: string;
} {
  if (longitude >= 127.5) {
    return { timezone: 9, timezoneName: "WIT" };
  } else if (longitude >= 113.5) {
    return { timezone: 8, timezoneName: "WITA" };
  } else {
    return { timezone: 7, timezoneName: "WIB" };
  }
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: {
      latitude: DEFAULT_CITY.latitude,
      longitude: DEFAULT_CITY.longitude,
      timezone: DEFAULT_CITY.timezone,
      timezoneName: DEFAULT_CITY.timezoneName,
    },
    locationName: DEFAULT_CITY.name,
    isGPS: false,
    status: "idle",
    errorMessage: null,
  });

  const requestGPSLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: "Geolocation tidak didukung oleh peramban ini.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: "loading", errorMessage: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const { timezone, timezoneName } = getTimezoneFromLongitude(lon);

        setState({
          location: {
            latitude: lat,
            longitude: lon,
            timezone,
            timezoneName,
          },
          locationName: `GPS Device (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`,
          isGPS: true,
          status: "success",
          errorMessage: null,
        });
      },
      (error) => {
        let msg = "Gagal mengambil lokasi GPS.";
        if (error.code === error.PERMISSION_DENIED) {
          msg =
            "Akses lokasi ditolak oleh pengguna. Menggunakan lokasi default (Jakarta).";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Informasi lokasi tidak tersedia pada device ini.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Waktu permintaan lokasi habis (timeout).";
        }

        setState((prev) => ({
          ...prev,
          status: error.code === error.PERMISSION_DENIED ? "denied" : "error",
          errorMessage: msg,
          isGPS: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, []);

  const selectCity = useCallback((city: City) => {
    setState({
      location: {
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        timezoneName: city.timezoneName,
      },
      locationName: city.name,
      isGPS: false,
      status: "success",
      errorMessage: null,
    });
  }, []);

  return {
    ...state,
    requestGPSLocation,
    selectCity,
  };
}
