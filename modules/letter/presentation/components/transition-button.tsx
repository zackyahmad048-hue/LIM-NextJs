'use client'

import { useActionState } from 'react'
import type { ActionResult } from '@/types/api'

export type ActionFn = (formData: FormData) => Promise<ActionResult<unknown>>

export function TransitionButton({ action, letterId, label, className }: { action: ActionFn; letterId: string; label: string; className?: string }) {
  const [state, formAction, pending] = useActionState(async (_prev: ActionResult<unknown>, fd: FormData) => action(fd), { success: false })
  return (
    <span className="inline-flex flex-col items-start">
      <form action={formAction} className="inline">
        <input type="hidden" name="letterId" value={letterId} />
        <button type="submit" disabled={pending} className={className ?? 'rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50'}>
          {pending ? 'Memproses…' : label}
        </button>
      </form>
      {state.error && <p role="alert" className="text-xs text-destructive">{state.error}</p>}
    </span>
  )
}
