import type { ActionResult } from "@/modules/shared/presentation/action-result";

export function ActionResultMessage({ state }: { state?: ActionResult }) {
  if (!state || !state.message || state.ok) return null;

  return (
    <p
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
    >
      {state.message}
    </p>
  );
}