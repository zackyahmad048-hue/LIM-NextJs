"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import LiquidEther from "@/components/LiquidEther";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

type AuroraBackgroundProps = {
  colors: string[];
  autoIntensity?: number;
  className?: string;
};

export default function AuroraBackground({
  colors,
  autoIntensity = 2.2,
  className,
}: AuroraBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isHydrated || prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <LiquidEther
        colors={colors}
        autoIntensity={isMobile ? autoIntensity * 0.5 : autoIntensity}
        autoSpeed={isMobile ? 0.25 : 0.5}
        resolution={isMobile ? 0.35 : 0.5}
      />
    </div>
  );
}
