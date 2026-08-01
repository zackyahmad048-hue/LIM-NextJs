"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import type { NavigationItem } from "@/types/navigation";

interface SidebarItemProps {
  item: NavigationItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({
  item,
  collapsed = false,
  onNavigate,
}: SidebarItemProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(true);

  const Icon = item.icon;

  const active =
    item.href && pathname.startsWith(item.href);

  if (item.items?.length) {
    return (
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-9 w-full items-center justify-between rounded-md px-2.5 text-sm hover:bg-muted"
        >
          <div className="flex items-center gap-2.5">
            {Icon && (
              <Icon className="h-4 w-4" />
            )}

            {!collapsed && (
              <span>{item.title}</span>
            )}
          </div>

          {!collapsed && (
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                open && "rotate-180"
              )}
            />
          )}
        </button>

        {open &&
          !collapsed &&
          item.items.map((child) => (
            <Link
              key={child.href}
              href={child.href!}
              onClick={onNavigate}
              className={cn(
                "ml-7 flex h-8 items-center rounded-md px-2.5 text-xs transition-colors",
                pathname === child.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {child.title}
            </Link>
          ))}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      onClick={onNavigate}
      className={cn(
        "flex h-9 items-center rounded-md text-sm transition-colors",
        collapsed
          ? "justify-center"
          : "gap-2.5 px-2.5",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      )}
    >
      {Icon && (
        <Icon className="h-4 w-4" />
      )}

      {!collapsed && (
        <span>{item.title}</span>
      )}
    </Link>
  );
}
