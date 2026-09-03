"use client";

import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import { useMemo, useState } from "react";
import {
  humanizeFileName,
  MEDIA_TYPE_LABELS,
  type MediaType,
} from "@/lib/media";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Reveal from "@/components/website/motion/reveal";
import { cn } from "@/lib/utils";

export interface PublicMediaItem {
  name: string;
  href: string;
  size: string;
  type: MediaType;
}

export const MEDIA_FILTERS: Array<{ label: string; value: "SEMUA" | MediaType }> = [
  { label: "Semua", value: "SEMUA" },
  { label: "Foto", value: "FOTO" },
  { label: "Video", value: "VIDEO" },
  { label: "Infografis", value: "INFOGRAFIS" },
];

function MediaTypeBadge({ type }: { type: MediaType }) {
  return (
    <span className="absolute left-2 top-2 z-10 rounded-sm border border-border/70 bg-background/95 px-1.5 py-0.5 font-data text-[10px] font-medium uppercase tracking-wide text-foreground">
      {MEDIA_TYPE_LABELS[type]}
    </span>
  );
}

function VideoTile({ alt }: { alt: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-card">
      <span className="flex items-center gap-2 p-3 text-center text-xs text-muted-foreground">
        <Play className="h-8 w-8 shrink-0 text-primary" />
        {alt}
      </span>
    </div>
  );
}

export default function MediaLightboxGrid({
  items,
}: {
  items: PublicMediaItem[];
}) {
  const [filter, setFilter] = useState<"SEMUA" | MediaType>("SEMUA");

  const filteredItems = useMemo(
    () => (filter === "SEMUA" ? items : items.filter((item) => item.type === filter)),
    [items, filter],
  );

  if (items.length === 0) return null;

  return (
    <div>
      {items.some((item) => item.type !== "FOTO") && (
        <div
          role="group"
          aria-label="Filter media"
          className="mb-6 flex flex-wrap items-center gap-2"
        >
          {MEDIA_FILTERS.map((filterOption) => {
            const count =
              filterOption.value === "SEMUA"
                ? items.length
                : items.filter((item) => item.type === filterOption.value).length;

            const isActive = filter === filterOption.value;

            return (
              <button
                key={filterOption.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(filterOption.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-foreground/30 bg-foreground/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {filterOption.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filteredItems.map((item, i) => {
          const alt = humanizeFileName(item.name);
          return (
            <Reveal key={item.href} index={i}>
              <div className="relative">
                {item.type !== "FOTO" && <MediaTypeBadge type={item.type} />}

                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Lihat ${alt}`}
                      className="group relative block aspect-square w-full overflow-hidden rounded-md border border-primary/25 bg-card transition hover:border-primary"
                    >
                      {item.type === "VIDEO" ? (
                        <VideoTile alt={alt} />
                      ) : (
                        <Image
                          src={item.href}
                          alt={alt}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      )}
                      {item.type === "VIDEO" && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <span className="rounded-full bg-black/35 p-3 text-white backdrop-blur-sm transition-colors group-hover:bg-primary">
                            <Play className="h-5 w-5" />
                          </span>
                        </span>
                      )}
                    </button>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl border-border bg-card">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-lg text-foreground">
                        {alt}
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Pratinjau {MEDIA_TYPE_LABELS[item.type]} dokumentasi: {alt}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                      {item.type === "VIDEO" ? (
                        <video
                          src={item.href}
                          controls
                          preload="metadata"
                          className="h-full w-full bg-card"
                        >
                          Browser Anda tidak mendukung pemutaran video.
                        </video>
                      ) : (
                        <Image
                          src={item.href}
                          alt={alt}
                          fill
                          sizes="(min-width: 768px) 60vw, 90vw"
                          className="object-contain"
                        />
                      )}
                    </div>

                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Buka asli di tab baru
                    </a>
                  </DialogContent>
                </Dialog>
              </div>
            </Reveal>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="rounded-md border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Belum ada media dengan kategori ini.
        </div>
      )}
    </div>
  );
}