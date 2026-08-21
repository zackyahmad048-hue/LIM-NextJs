import * as React from "react";

export type MotionQuality = "high" | "medium" | "low";

export interface MotionQualityScale {
  resolution: number;
  speed: number;
  intensity: number;
  poisson: number;
}

export const MOTION_QUALITY_SCALE: Record<MotionQuality, MotionQualityScale> = {
  high: { resolution: 1, speed: 1, intensity: 1, poisson: 1 },
  medium: { resolution: 0.7, speed: 0.6, intensity: 0.7, poisson: 0.75 },
  low: { resolution: 0.5, speed: 0.35, intensity: 0.5, poisson: 0.5 },
};

const MOBILE_BREAKPOINT = 768;

function detectQuality(): MotionQuality {
  const isMobile =
    window.innerWidth < MOBILE_BREAKPOINT ||
    /Android|iPhone|iPad|iPod|Mobile|Mobi/i.test(navigator.userAgent);

  const cores = navigator.hardwareConcurrency ?? 8;
  const mem =
    "deviceMemory" in navigator
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      : undefined;

  if (isMobile) {
    if (cores <= 4 || (mem !== undefined && mem <= 4)) return "low";
    if (cores <= 8 || (mem !== undefined && mem <= 6)) return "medium";
    return "high";
  }

  if (cores <= 2 || (mem !== undefined && mem <= 2)) return "low";
  if (cores <= 6 || (mem !== undefined && mem <= 4)) return "medium";
  return "high";
}

export function useMotionQuality(): MotionQuality {
  const [quality] = React.useState<MotionQuality>(() => {
    if (typeof window === "undefined") return "high";
    return detectQuality();
  });

  return quality;
}