"use client";

import { useEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";

interface RevealProps {
  children: React.ReactNode;
  from?: "left" | "right";
  delay?: number;
  className?: string;
}

export default function Reveal({
  children,
  from = "left",
  delay = 0,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const controls = useAnimationControls();
  const x = from === "left" ? -28 : 28;

  useEffect(() => {
    if (reduced) {
      controls.set({ opacity: 1, x: 0 });
    }
  }, [reduced, controls]);

  return (
    <motion.div
      initial={{ opacity: 0, x }}
      animate={controls}
      whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
      viewport={reduced ? undefined : { once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}