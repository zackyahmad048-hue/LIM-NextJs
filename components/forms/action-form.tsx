'use client'

import { useActionState } from 'react'
import type { ActionResult } from '@/types/api'

export type ActionFn = (formData: FormData) => Promise<ActionResult<unknown>>

export function ActionForm({
  action,
  children,
  submitLabel = 'Simpan',
  className,
}: {
  action: ActionFn
  children: React.ReactNode
  submitLabel?: string
  className?: string
}) {
  const [state, formAction, pending] = useActionState(async (_prev: ActionResult<unknown>, formData: FormData) => action(formData), { success: false })

  return (
    <form action={formAction} className={className}>
      {state.error && <p role="alert" className="mb-4 rounded-md bg-destructive/10 p-2 text-sm text-destructive">{state.error}</p>}
      {state.success && <p role="status" className="mb-4 rounded-md bg-success/10 p-2 text-sm text-success">Berhasil disimpan.</p>}
      {children}
      <button type="submit" disabled={pending} className="mt-4 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">
        {pending ? 'Menyimpan…' : submitLabel}
      </button>
    </form>
  )
}

export function FieldError({ errors, name }: { errors?: Record<string, string[]>; name: string }) {
  const list = errors?.[name]
  if (!list?.length) return null
  return <p className="text-xs text-destructive">{list[0]}</p>
}
