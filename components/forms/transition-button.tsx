'use client'

import { useActionState } from 'react'
import type { ActionResult } from '@/types/api'

type Action = (formData: FormData) => Promise<ActionResult<unknown>>

export function TransitionButton({ action, id, fieldName, label, className }: { action: Action; id: string; fieldName: string; label: string; className?: string }) {
  const [state, formAction, pending] = useActionState(async (_prev: ActionResult<unknown>, fd: FormData) => action(fd), { success: false })
  return (
    <span className="inline-flex flex-col items-start">
      <form action={formAction} className="inline">
        <input type="hidden" name={fieldName} value={id} />
        <button type="submit" disabled={pending} className={className ?? 'rounded-md border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50'}>
          {pending ? 'Memproses…' : label}
        </button>
      </form>
      {state.error && <p role="alert" className="text-xs text-destructive">{state.error}</p>}
    </span>
  )
}
