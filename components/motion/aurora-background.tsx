"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { MeshGradient } from "@paper-design/shaders-react";
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

  if (!isHydrated || prefersReducedMotion) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {isMobile ? (
        <MeshGradient
          colors={colors}
          speed={0.6}
          distortion={0.35}
          swirl={0.3}
          fit="cover"
          className="h-full w-full"
        />
      ) : (
        <LiquidEther colors={colors} autoIntensity={autoIntensity} />
      )}
    </div>
  );
}
