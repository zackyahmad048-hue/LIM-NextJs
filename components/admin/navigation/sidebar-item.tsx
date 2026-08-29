"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { NavigationItem } from "@/types/navigation";

interface SidebarItemProps {
  item: NavigationItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}

function isActiveHref(href: string | undefined, pathname: string) {
  if (!href) return false;
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

const activeClass =
  "bg-admin-sidebar-accent text-admin-sidebar-accent-fg font-medium";
const hoverClass = "hover:bg-admin-sidebar-accent hover:text-admin-sidebar-accent-fg";
const baseTextClass = "text-admin-sidebar-fg/90";

export function SidebarItem({
  item,
  collapsed = false,
  onNavigate,
}: SidebarItemProps) {
  const pathname = usePathname();

  const [manualOpen, setManualOpen] = useState<boolean | null>(null);

  const Icon = item.icon;

  const active = isActiveHref(item.href, pathname);
  const childActive =
    item.items?.some((child) => isActiveHref(child.href, pathname)) ?? false;
  const open = manualOpen ?? childActive;

  const renderChildLinks = () =>
    item.items?.map((child) => {
      const childCurrent = isActiveHref(child.href, pathname);
      return (
        <Link
          key={child.href + child.title}
          href={child.href!}
          onClick={onNavigate}
          aria-current={childCurrent ? "page" : undefined}
          className={cn(
            "flex h-8 items-center rounded-md px-3 text-xs transition-colors duration-200",
            baseTextClass,
            childCurrent ? activeClass : hoverClass,
          )}
        >
          {child.title}
        </Link>
      );
    });

  if (!item.items?.length) {
    const link = (
      <Link
        href={item.href!}
        onClick={onNavigate}
        aria-label={item.title}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-9 w-full items-center rounded-lg text-sm transition-colors duration-200",
          collapsed ? "justify-center" : "gap-2.5 px-3",
          baseTextClass,
          active ? activeClass : hoverClass,
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        <span
          className={cn(
            "min-w-0 truncate whitespace-nowrap transition-opacity duration-200 ease-in-out",
            collapsed ? "w-0 opacity-0" : "flex-1",
          )}
        >
          {item.title}
        </span>
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      );
    }

    return link;
  }

  const trigger = (
    <button
      type="button"
      onClick={() => !collapsed && setManualOpen(!open)}
      aria-expanded={collapsed ? undefined : open}
      aria-label={collapsed ? item.title : undefined}
      className={cn(
        "flex h-9 w-full items-center rounded-lg text-sm transition-colors duration-200",
        collapsed ? "justify-center" : "gap-2.5 px-3",
        baseTextClass,
        hoverClass,
        childActive && !collapsed && "font-medium",
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span
        className={cn(
          "min-w-0 truncate whitespace-nowrap text-left transition-opacity duration-200 ease-in-out",
          collapsed ? "w-0 opacity-0" : "flex-1",
        )}
      >
        {item.title}
      </span>
      {!collapsed && (
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-in-out",
            "text-admin-sidebar-fg/60",
            open && "rotate-180",
          )}
        />
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
        <PopoverContent side="right" align="start" className="w-52 gap-1 p-1 bg-admin-sidebar-bg border-admin-sidebar-border">
          <p className="px-3 py-1.5 text-xs font-medium text-admin-sidebar-fg/60">
            {item.title}
          </p>
          <div className="space-y-0.5">{renderChildLinks()}</div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="space-y-0.5">
      {trigger}

      <div
        aria-hidden={!open}
        className={cn(
          "grid transition-all duration-300 ease-in-out motion-reduce:transition-none",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "invisible grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="ml-5 overflow-hidden border-l border-admin-sidebar-border/50 pl-2">
          <div className="space-y-0.5 py-0.5">{renderChildLinks()}</div>
        </div>
      </div>
    </div>
  );
}
