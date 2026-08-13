"use client";

import { motion, useReducedMotion } from "motion/react";
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
  const x = from === "left" ? -28 : 28;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}