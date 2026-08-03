"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";

export function AppThemeProvider({ scriptProps, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider
      {...props}
      scriptProps={{
        ...scriptProps,
        type: typeof window === "undefined" ? "text/javascript" : "text/plain",
      }}
    />
  );
}
