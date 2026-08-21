"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ActionResultMessage } from "@/components/admin/shared/action-result-message";
import {
  INITIAL_ACTION_RESULT,
  type ActionResult,
} from "@/modules/shared/presentation/action-result";
import { cn } from "@/lib/utils";

interface ActionFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  submitLabel: string;
  submitIcon?: ReactNode;
  className?: string;
  /** Path to refresh after success; redirect when `redirectOnSuccess` is set. */
  refreshOnSuccess?: string;
  redirectOnSuccess?: string;
}

export function ActionForm({
  action,
  children,
  submitLabel,
  submitIcon,
  className,
  refreshOnSuccess,
  redirectOnSuccess,
}: ActionFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ACTION_RESULT,
  );

  useEffect(() => {
    if (!state.ok || !state.message) return;
    if (redirectOnSuccess) {
      router.push(redirectOnSuccess);
      return;
    }
    if (refreshOnSuccess) {
      router.push(refreshOnSuccess);
      return;
    }
    router.refresh();
  }, [state, redirectOnSuccess, refreshOnSuccess, router]);

  return (
    <form action={formAction} className={cn("space-y-3", className)}>
      {children}

      <ActionResultMessage state={state} />

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          {submitIcon}
          {pending ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}