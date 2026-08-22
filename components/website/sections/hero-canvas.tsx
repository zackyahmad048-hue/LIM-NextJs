"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

import {
  MOTION_QUALITY_SCALE,
  useMotionQuality,
} from "@/hooks/use-motion-quality";

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), {
  ssr: false,
});

export function HeroCanvas() {
  const prefersReducedMotion = useReducedMotion();
  const quality = useMotionQuality();

  if (prefersReducedMotion) return null;

  const shaderScale = MOTION_QUALITY_SCALE[quality];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <LiquidEther
        colors={["#7C2D12", "#C2410C", "#F59E0B"]}
        resolution={0.5 * shaderScale.resolution}
        autoSpeed={0.5 * shaderScale.speed}
        autoIntensity={1.2 * shaderScale.intensity}
        iterationsPoisson={Math.round(32 * shaderScale.poisson)}
      />
    </div>
  );
}
