"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { filterNavigation } from "@/modules/authorization/application/permission-nav";

interface CommandMenuProps {
  roleSlugs: string[];
}

/** Pencarian menu global admin (Ctrl/Cmd+K). */
export function CommandMenu({ roleSlugs }: CommandMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const navigation = filterNavigation(roleSlugs);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      {/* Ikon saja: header admin punya ruang terbatas (breadcrumb + chip
          tanggal + blok user sudah memenuhi baris), label & kbd hint tinggal
          di tooltip/aria-label — pintasan Ctrl/Cmd+K tetap berlaku. */}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Cari halaman admin"
        title="Cari menu (Ctrl K)"
        onClick={() => setOpen(true)}
        className="text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Search className="size-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari halaman admin..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil.</CommandEmpty>

          {navigation.map((item) =>
            item.items?.length ? (
              <CommandGroup key={item.title} heading={item.title}>
                {item.items.map((child) => (
                  <CommandItem
                    key={child.href ?? child.title}
                    value={`${item.title} ${child.title}`}
                    onSelect={() => child.href && go(child.href)}
                  >
                    {child.icon && <child.icon className="mr-2 size-4" />}
                  {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              item.href && (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => go(item.href!)}
                >
                  {item.icon && <item.icon className="mr-2 size-4" />}
                  {item.title}
                </CommandItem>
              )
            ),
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}