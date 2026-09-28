"use client";

import { useState } from "react";
import { X, FileText, Search, Code, Activity, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Entity {
  id: string;
  type: "page" | "post" | "product" | "component" | "media" | "user";
  title: string;
  status: "draft" | "published" | "scheduled" | "archived" | "pending_review";
  updatedAt: string;
  updatedBy: string;
  tenantId: string;
}

interface Props {
  entity: Entity | null;
  onClose: () => void;
  onAction?: (action: string, entity: Entity) => void;
}

const statusConfig: Record<Entity["status"], { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "text-muted-foreground", icon: <FileText className="h-3 w-3" /> },
  published: { label: "Published", color: "text-primary", icon: <FileText className="h-3 w-3" /> },
  scheduled: { label: "Scheduled", color: "text-warning", icon: <FileText className="h-3 w-3" /> },
  archived: { label: "Archived", color: "text-destructive", icon: <FileText className="h-3 w-3" /> },
  pending_review: { label: "Pending Review", color: "text-warning", icon: <FileText className="h-3 w-3" /> },
};

const typeIcons: Record<Entity["type"], React.ReactNode> = {
  page: <FileText className="h-4 w-4" />,
  post: <FileText className="h-4 w-4" />,
  product: <Shield className="h-4 w-4" />,
  component: <Code className="h-4 w-4" />,
  media: <Shield className="h-4 w-4" />,
  user: <Users className="h-4 w-4" />,
};

export function ContextPanel({ entity, onClose, onAction }: Props) {
  const [activeTab, setActiveTab] = useState("content");

  if (!entity) {
    return (
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col h-dvh",
          "bg-card",
          "border-l border-border",
        )}
        aria-label="Entity details"
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-center p-6 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Select an entity to view details</p>
            <p className="text-xs mt-1">Click any row in the table</p>
          </div>
        </div>
      </aside>
    );
  }

  const status = statusConfig[entity.status];

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col h-dvh w-80",
        "bg-card",
        "border-l border-border",
        "transition-transform duration-300 ease-out",
      )}
      aria-label="Entity details"
    >
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              entity.status === "published" && "bg-primary",
              entity.status === "draft" && "bg-muted-foreground",
              entity.status === "scheduled" && "bg-warning",
              entity.status === "archived" && "bg-destructive",
              entity.status === "pending_review" && "bg-warning",
            )}
          />
          <span className="text-sm font-medium truncate">{entity.title}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary border border-border">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {typeIcons[entity.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{entity.title}</span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border",
                  status.color,
                  "border-current",
                )}
              >
                {status.icon}
                {status.label}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground font-mono">{entity.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-secondary border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Updated</p>
            <p className="font-medium font-mono">{entity.updatedAt}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">By</p>
            <p className="font-medium truncate">{entity.updatedBy}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary border border-border p-1">
            <TabsTrigger value="content" className="text-xs">
              Content
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4 space-y-3">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => onAction?.("edit", entity)}
              >
                <FileText className="h-4 w-4" />
                Edit Content
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => onAction?.("preview", entity)}
              >
                <Search className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => onAction?.("duplicate", entity)}
              >
                <FileText className="h-4 w-4" />
                Duplicate
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4 space-y-3">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary border border-border">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Published by {entity.updatedBy}</p>
                  <p className="text-xs text-muted-foreground">{entity.updatedAt}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary border border-border">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Created</p>
                  <p className="text-xs text-muted-foreground">{entity.updatedAt}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-3">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => onAction?.("seo", entity)}
              >
                <Search className="h-4 w-4" />
                SEO Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => onAction?.("permissions", entity)}
              >
                <Shield className="h-4 w-4" />
                Permissions
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => onAction?.("api", entity)}
              >
                <Code className="h-4 w-4" />
                API Access
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start gap-2"
                onClick={() => onAction?.("delete", entity)}
              >
                <X className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}