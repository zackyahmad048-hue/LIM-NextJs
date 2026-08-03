"use client";

import { motion } from "motion/react";

export function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 0.8,
        ease: "linear",
      }}
      className="h-10 w-10 rounded-full border-4 border-orange-500 border-t-transparent"
    />
  );
}
