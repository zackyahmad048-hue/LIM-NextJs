"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";

type RevealDirection = "up" | "down" | "left" | "right" | "scale";

const OFFSETS: Record<
  RevealDirection,
  { x?: number; y?: number; scale?: number }
> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: -28 },
  right: { x: 28 },
  scale: { scale: 0.96 },
};

interface RevealProps {
  children: React.ReactNode;
  from?: RevealDirection;
  /**
   * Posisi item dalam daftar untuk stagger otomatis.
   * Tiap langkah menambah 70ms, dibatasi maksimal 350ms agar item
   * di bawah grid panjang tidak menunggu terlalu lama.
   */
  index?: number;
  delay?: number;
  className?: string;
}

export default function Reveal({
  children,
  from = "up",
  index,
  delay = 0,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const stagger = typeof index === "number" ? Math.min(index * 0.07, 0.35) : 0;
  const totalDelay = delay + stagger;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, ...OFFSETS[from] }}
      whileInView={reduced ? undefined : { opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={reduced ? undefined : { once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ...(totalDelay > 0 && { delay: totalDelay }),
        ease: EASE_OUT,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
