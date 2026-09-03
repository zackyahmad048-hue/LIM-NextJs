"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";

type RevealDirection = "up" | "down" | "left" | "right" | "scale";

const DEFAULT_OFFSETS: Record<
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
   * Jarak geser (px) untuk arah up/down/left/right.
   * Default mengikuti nilai per-arah; lewati untuk memperbesar
   * perjalanan entri (misal hero mengikuti referensi DIGDAYA).
   */
  distance?: number;
  /**
   * Skala awal untuk arah "scale". Default 0.96.
   */
  startScale?: number;
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
  distance,
  startScale,
  index,
  delay = 0,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const stagger = typeof index === "number" ? Math.min(index * 0.07, 0.35) : 0;
  const totalDelay = delay + stagger;

  const defaultOffset = DEFAULT_OFFSETS[from];
  let offset: { x?: number; y?: number; scale?: number };

  if (from === "scale") {
    offset = { scale: startScale ?? defaultOffset.scale };
  } else if (from === "left" || from === "right") {
    const base = distance ?? defaultOffset.x;
    offset = { x: (base ?? 0) * (from === "left" ? -1 : 1) };
  } else {
    const base = distance ?? defaultOffset.y;
    offset = { y: (base ?? 0) * (from === "down" ? -1 : 1) };
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, ...offset }}
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
