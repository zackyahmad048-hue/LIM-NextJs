import { cn } from '@/lib/utils'

type Variant = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'muted'

const variantClass: Record<Variant, string> = {
  neutral: 'bg-secondary text-secondary-foreground',
  info: 'bg-info text-info-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  danger: 'bg-destructive text-white',
  muted: 'bg-muted text-muted-foreground',
}

export function StatusBadge({ label, variant = 'neutral', className }: { label: string; variant?: Variant; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variantClass[variant], className)}>
      {label}
    </span>
  )
}
