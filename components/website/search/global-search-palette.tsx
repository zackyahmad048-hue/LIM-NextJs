"use client";

import { useRouter } from "next/navigation";
import {
  Compass,
  FileText,
  Image as ImageIcon,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { searchSite } from "@/modules/cms/presentation/site-search.action";
import {
  EMPTY_SEARCH_RESULT,
  type SiteSearchResult,
} from "@/modules/cms/presentation/site-search.types";
import { cn } from "@/lib/utils";

const GROUPS: Array<{
  key: "posts" | "media" | "falak";
  label: string;
  icon: LucideIcon;
}> = [
  { key: "posts", label: "Artikel", icon: FileText },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "falak", label: "Layanan Falak", icon: Compass },
];

interface FlatHit {
  href: string;
  title: string;
  meta: string;
}

export default function GlobalSearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SiteSearchResult>(EMPTY_SEARCH_RESULT);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const requestCountRef = useRef(0);

  const flatHits = useMemo<FlatHit[]>(() => {
    const hits: FlatHit[] = [];

    for (const group of GROUPS) {
      for (const item of result[group.key]) {
        hits.push({ href: item.href, title: item.title, meta: item.meta });
      }
    }

    return hits;
  }, [result]);

  useEffect(() => {
    function onGlobalKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onGlobalKeyDown);

    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, []);

  useEffect(() => {
    const q = query.trim();
    const requestId = ++requestCountRef.current;

    const timer = window.setTimeout(() => {
      if (!q) {
        setResult(EMPTY_SEARCH_RESULT);
        setActiveIndex(0);
        setLoading(false);
        return;
      }

      setLoading(true);

      searchSite(q)
        .then((next) => {
          if (requestCountRef.current === requestId) {
            setResult(next);
            setActiveIndex(0);
          }
        })
        .catch(() => {
          if (requestCountRef.current === requestId) {
            setResult(EMPTY_SEARCH_RESULT);
          }
        })
        .finally(() => {
          if (requestCountRef.current === requestId) {
            setLoading(false);
          }
        });
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  function resetSearch() {
    setQuery("");
    setResult(EMPTY_SEARCH_RESULT);
    setActiveIndex(0);
    setLoading(false);
  }

  function closePalette() {
    setOpen(false);
    resetSearch();
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      resetSearch();
    }
  }

  function goToActive() {
    const active = flatHits[activeIndex];

    if (active) {
      router.push(active.href);
      closePalette();
    }
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (flatHits.length > 0) {
        setActiveIndex((index) => (index + 1) % flatHits.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      if (flatHits.length > 0) {
        setActiveIndex(
          (index) => (index - 1 + flatHits.length) % flatHits.length,
        );
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      goToActive();
    }
  }

  const searching = query.trim().length > 0 && loading;
  const showEmptyState =
    query.trim().length > 0 && !loading && flatHits.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Cari di seluruh situs"
          className="inline-flex h-8 items-center gap-2 rounded-md border border-border px-2.5 text-foreground/70 transition-colors hover:border-primary hover:text-primary"
        >
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline text-xs font-medium">Cari</span>
          <kbd className="hidden lg:inline-flex items-center rounded-sm border border-border px-1 font-data text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </DialogTrigger>

      <DialogContent
        className="top-[16vh] max-w-lg translate-y-0 border-border bg-card outline-none"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Cari di seluruh situs</DialogTitle>
          <DialogDescription>
            Temukan artikel, media, atau layanan falak.
          </DialogDescription>
        </DialogHeader>

        <label htmlFor="palette-search" className="sr-only">
          Kata kunci pencarian
        </label>
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-primary" />
          <input
            id="palette-search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Cari artikel, media, falak…"
            className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searching && (
            <span className="font-data text-[10px] uppercase text-muted-foreground">
              Mencari…
            </span>
          )}
        </div>

        <div
          role="listbox"
          aria-label="Hasil pencarian"
          className="max-h-[50vh] overflow-y-auto p-2"
        >
          {GROUPS.map((group) => {
            const items = result[group.key];

            if (items.length === 0) return null;

            const GroupIcon = group.icon;

            return (
              <div key={group.key} role="group" aria-label={group.label}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <GroupIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-data text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </span>
                </div>

                <ul className="space-y-0.5 pb-2">
                  {items.map((item) => {
                    const flatIndex = flatHits.findIndex(
                      (hit) => hit.href === item.href && hit.title === item.title,
                    );
                    const isActive = flatIndex === activeIndex;

                    return (
                      <li key={`${group.key}:${item.href}`} role="option" aria-selected={isActive}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(flatIndex)}
                          onClick={() => {
                            router.push(item.href);
                            closePalette();
                          }}
                          className={cn(
                            "flex w-full items-baseline justify-between gap-3 rounded-sm px-3 py-2 text-left transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-accent",
                          )}
                        >
                          <span className="truncate text-sm">{item.title}</span>
                          <span
                            className={cn(
                              "shrink-0 text-[11px]",
                              isActive
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground",
                            )}
                          >
                            {item.meta}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {!query.trim() && !loading && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              Ketik kata kunci untuk mencari artikel, media, atau layanan falak.
            </p>
          )}

          {showEmptyState && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              Tidak ada hasil untuk &ldquo;{query.trim()}&rdquo;.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-4 py-2.5">
          <span className="font-data text-[10px] text-muted-foreground">
            ↑↓ jelajahi
          </span>
          <span className="font-data text-[10px] text-muted-foreground">
            Enter buka
          </span>
          <span className="font-data text-[10px] text-muted-foreground">
            Esc tutup
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}