"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const value = useMemo(
    () => ({
      collapsed,
      toggle: () => setCollapsed((prev) => !prev),
      open: () => setCollapsed(false),
      close: () => setCollapsed(true),
    }),
    [collapsed]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar must be used inside SidebarProvider"
    );
  }

  return context;
}