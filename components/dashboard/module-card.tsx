// components/dashboard/module-card.tsx
import Link from 'next/link'

interface ModuleCardProps {
  title: string
  description: string
  href: string
}

// Seluruh kartu adalah tautan tunggal: tidak ada tombol atau menu tanpa aksi.
export function ModuleCard({ title, description, href }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </Link>
  )
}
