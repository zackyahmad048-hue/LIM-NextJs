export type ActionResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const INITIAL_ACTION_RESULT: ActionResult = { ok: false };