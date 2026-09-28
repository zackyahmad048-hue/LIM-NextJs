"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Search, Building2, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: "free" | "pro" | "enterprise";
}

interface User {
  name: string;
  email: string;
  image?: string | null;
  roleLabel: string;
}

interface Props {
  user: User;
  tenants: Tenant[];
  currentTenantId: string;
  onTenantChange: (tenantId: string) => void;
  onLogout: () => void;
}

export function TenantBar({
  user,
  tenants,
  currentTenantId,
  onTenantChange,
  onLogout,
}: Props) {
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const tenantMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentTenant = tenants.find((t) => t.id === currentTenantId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tenantMenuRef.current && !tenantMenuRef.current.contains(event.target as Node)) {
        setTenantMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const planColors: Record<Tenant["plan"], string> = {
    free: "text-muted-foreground",
    pro: "text-primary",
    enterprise: "text-warning",
  };

  const planLabels: Record<Tenant["plan"], string> = {
    free: "Free",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-40 flex h-12 items-center gap-3 border-b px-4",
        "bg-background/80",
        "border-b border-border",
        "backdrop-blur-sm",
      )}
      role="banner"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
          <div
            className="relative flex items-center gap-1.5 px-2 py-1 pr-6 rounded-md bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setTenantMenuOpen(!tenantMenuOpen)}
            ref={tenantMenuRef}
          >
            <span className="font-medium text-sm truncate max-w-[180px]">
              {currentTenant?.name ?? "Select Tenant"}
            </span>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full border",
                planColors[currentTenant?.plan ?? "free"],
                "border-current",
              )}
            >
              {currentTenant ? planLabels[currentTenant.plan] : "—"}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-muted-foreground transition-transform",
                tenantMenuOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </div>
        </div>

        {tenantMenuOpen && (
          <div
            className="absolute left-4 top-full z-50 mt-1 w-64 bg-popover border border-border shadow-xl rounded-lg"
            ref={tenantMenuRef}
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tenants..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="mt-2 max-h-60 overflow-y-auto space-y-1">
                {tenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      onTenantChange(tenant.id);
                      setTenantMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left",
                      tenant.id === currentTenantId
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {tenant.logo ? (
                        <Image
                          src={tenant.logo}
                          alt=""
                          width={20}
                          height={20}
                          className="h-5 w-5 rounded"
                        />
                      ) : (
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="font-medium truncate">{tenant.name}</span>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full border",
                        planColors[tenant.plan],
                        "border-current",
                      )}
                    >
                      {planLabels[tenant.plan]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        
      </div>

      <div className="flex items-center gap-1">
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 pr-6 rounded-md bg-card border border-border hover:border-primary/50 transition-colors"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium truncate max-w-[140px]">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                {user.roleLabel}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-muted-foreground transition-transform",
                userMenuOpen && "rotate-180",
              )}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-48 bg-popover border border-border shadow-xl rounded-lg">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}