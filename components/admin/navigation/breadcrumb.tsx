"use client";

import { usePathname } from "next/navigation";

export function Breadcrumb() {
  const pathname = usePathname();

  return (
    <h1 className="text-lg font-semibold capitalize">
      {pathname === "/admin" ? "Dashboard" : pathname.split("/").pop()}
    </h1>
  );
}
