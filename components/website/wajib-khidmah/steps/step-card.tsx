"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/ease";

interface StepCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function StepCard({ title, description, children }: StepCardProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

interface RevealProps {
  show: boolean;
  children: ReactNode;
  className?: string;
}

export function Reveal({ show, children, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, height: 0, y: -6 }}
      animate={
        show
          ? { opacity: 1, height: "auto", y: 0 }
          : reduce
            ? { opacity: 0 }
            : { opacity: 0, height: 0, y: -6 }
      }
      transition={{ duration: 0.28, ease: EASE_OUT }}
      className={cn("overflow-hidden", className)}
      aria-hidden={!show}
    >
      {show ? children : null}
    </motion.div>
  );
}
