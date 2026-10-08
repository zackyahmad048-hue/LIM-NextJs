import { revalidatePath } from "next/cache";
import { ZodError, type ZodType } from "zod";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import type { PermissionSlug } from "@/modules/authorization/application/permission.service";
import type { ActionResult } from "@/modules/shared/presentation/action-result";

/** Error expected: pesannya aman ditampilkan apa adanya ke pengguna. */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export interface ActionContext {
  user: { id: string };
  roleSlugs: string[];
  permissionSlugs: string[];
}

interface DefineActionConfig<TInput, TData> {
  /** Satu permission slug per action (bukan role check). */
  permission: PermissionSlug;
  schema?: ZodType<TInput>;
  revalidate?: string | readonly string[];
  handler: (input: TInput, context: ActionContext) => Promise<TData>;
}

/**
 * Action shell bersama (ADR-011): session/permission → validasi input → handler
 * → revalidate cache → pemetaan error ke `ActionResult` kanonik. Pengujian
 * memakai `vi.mock` pada modul guard, bukan dependency injection.
 */
export function defineAction<TInput, TData = void>(
  config: DefineActionConfig<TInput, TData>,
) {
  return async (raw: TInput): Promise<ActionResult<TData>> => {
    try {
      const context = await requireSessionWithPermissions([config.permission]);
      const input = config.schema ? config.schema.parse(raw) : raw;
      const data = await config.handler(input, context);

      const paths =
        config.revalidate === undefined
          ? []
          : typeof config.revalidate === "string"
            ? [config.revalidate]
            : config.revalidate;
      for (const path of paths) revalidatePath(path);

      return { ok: true, data };
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const key = issue.path.length > 0 ? issue.path.join(".") : "_form";
          fieldErrors[key] ??= issue.message;
        }
        return { ok: false, message: "Input tidak valid.", fieldErrors };
      }
      if (error instanceof ActionError) {
        return { ok: false, message: error.message };
      }
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        return { ok: false, message: "Sesi tidak valid. Silakan login kembali." };
      }
      if (error instanceof Error && error.message === "FORBIDDEN") {
        return { ok: false, message: "Anda tidak memiliki izin untuk melakukan aksi ini." };
      }
      console.error(`[defineAction:${config.permission}]`, error);
      return { ok: false, message: "Terjadi kesalahan." };
    }
  };
}
