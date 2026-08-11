"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import LiquidEther from "@/components/LiquidEther";
import { useIsMobile } from "@/hooks/use-mobile";

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

  if (!isHydrated || prefersReducedMotion || isMobile) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      <LiquidEther colors={colors} autoIntensity={autoIntensity} />
    </div>
  );
}
