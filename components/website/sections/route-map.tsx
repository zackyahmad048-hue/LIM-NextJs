"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/ease";
import { HubDot } from "@/components/shared/hub-dot";
import FolioSection from "@/components/website/taqwim/folio-section";

const HUB = { x: 62, y: 88, label: "Kediri" };

const ROUTES = [
  { label: "Jawa Timur", x: 252, y: 42, dy: -20 },
  { label: "Jawa Tengah", x: 412, y: 122, dy: 26 },
  { label: "Jawa Barat", x: 584, y: 48, dy: -20 },
  { label: "Sumatera", x: 724, y: 130, dy: 26 },
  { label: "Kalimantan", x: 866, y: 58, dy: -20 },
  { label: "Sulawesi", x: 1004, y: 134, dy: 26 },
] as const;

function pathTo(x: number, y: number) {
  const midX = (HUB.x + x) / 2;
  const midY = y < HUB.y ? y + 52 : y - 52;
  return `M ${HUB.x} ${HUB.y} Q ${midX} ${midY} ${x} ${y}`;
}

const REGION_LIST = [
  "Jawa Timur",
  "Jawa Tengah",
  "Jawa Barat",
  "Sumatera",
  "Kalimantan",
  "Sulawesi",
  
];

export default function RouteMap() {
  return (
    <FolioSection
      arabic="شبكة"
      label="Jaringan Dakwah"
      contentClassName="py-8 sm:py-10 lg:py-14"
    >
      <div className="border-y border-border pt-8 sm:pt-10">
        {/* Desktop fan */}
        <svg
          viewBox="0 0 1060 172"
          className="mt-2 hidden w-full md:block"
          aria-label="Peta rute dakwah dari Kediri ke penjuru Nusantara"
          role="img"
        >
          {ROUTES.map((r) => (
            <motion.path
              key={r.label}
              d={pathTo(r.x, r.y)}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1.25}
              strokeDasharray="4 5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.15, ease: EASE_OUT }}
            />
          ))}

          {ROUTES.map((r) => (
            <g key={r.label}>
              <motion.circle
                cx={r.x}
                cy={r.y}
                r={6}
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth={1.5}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 1.15, ease: EASE_OUT }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <text
                x={r.x}
                y={r.y + r.dy}
                textAnchor="middle"
                className="fill-foreground font-data"
                fontSize={13}
              >
                {r.label}
              </text>
            </g>
          ))}

          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <circle cx={HUB.x} cy={HUB.y} r={10} fill="var(--primary)" />
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r={15}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1.25}
              strokeDasharray="3 4"
            />
            <text
              x={HUB.x}
              y={HUB.y - 26}
              textAnchor="middle"
              className="fill-foreground font-data"
              fontSize={14}
              fontWeight={600}
            >
              {HUB.label}
            </text>
          </motion.g>
        </svg>

        {/* Mobile list */}
        <ul className="mt-2 border-l border-dashed border-primary/50 pl-5 md:hidden">
          {REGION_LIST.map((label) => (
            <li key={label} className="relative pb-4 last:pb-0">
              <HubDot className="absolute -left-5.75 top-1 h-2 w-2" />
              <span className="font-sans text-sm text-foreground">{label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 pb-8 font-data text-[10px] uppercase text-muted-foreground sm:pb-10">
          Dari markas di Kediri, program dan pembinaan LIM menjangkau cabang di
          penjuru Nusantara.
        </p>
      </div>
    </FolioSection>
  );
}