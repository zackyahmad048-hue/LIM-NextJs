"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const value = useMemo(
    () => ({
      collapsed,
      toggle: () => setCollapsed((prev) => !prev),
      open: () => setCollapsed(false),
      close: () => setCollapsed(true),
      isMobile,
      mobileOpen,
      openMobile: () => setMobileOpen(true),
      closeMobile: () => setMobileOpen(false),
      toggleMobile: () => setMobileOpen((prev) => !prev),
    }),
    [collapsed, isMobile, mobileOpen],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }

  return context;
}
