import { NAVIGATION } from "@/config/navigation";
import type { NavigationItem } from "@/types/navigation";

import { DEFAULT_PERMISSION_MATRIX } from "./permission.matrix";
import { hasAnyPermission } from "./permission.service";

function isAllowed(roleSlugs: string[], permissions?: string[]): boolean {
  if (!permissions || permissions.length === 0) return true;
  return hasAnyPermission(roleSlugs, permissions, DEFAULT_PERMISSION_MATRIX);
}

export function filterNavigation(roleSlugs: string[]): NavigationItem[] {
  return NAVIGATION.filter((item) => isAllowed(roleSlugs, item.permissions))
    .map((item) =>
      item.items
        ? {
            ...item,
            items: item.items.filter((child) =>
              isAllowed(roleSlugs, child.permissions),
            ),
          }
        : item,
    )
    .filter((item) => !item.items || item.items.length > 0);
}
