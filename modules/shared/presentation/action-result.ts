export type ActionResult<TData = undefined> = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  data?: TData;
};

export const INITIAL_ACTION_RESULT: ActionResult = { ok: false };
