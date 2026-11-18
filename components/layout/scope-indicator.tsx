import { Building2, Globe, User, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { UserScope } from '@/modules/authentication/application/get-user-scope'

const scopeIcons: Record<UserScope['kind'], LucideIcon> = {
  GLOBAL: Globe,
  ORGANIZATIONAL: Building2,
  PERSONAL: User,
}

// Menampilkan cakupan data akun (Pusat / nama organisasi / data pribadi).
// Selalu ikon + teks, tidak hanya warna. Penanda tampilan saja — scope ditegakkan server.
export function ScopeIndicator({ scope, className }: { scope: UserScope; className?: string }) {
  const Icon = scopeIcons[scope.kind]
  return (
    <Badge variant="outline" className={className} title={scope.label}>
      <Icon aria-hidden className="size-3.5" />
      <span className="sr-only">Cakupan data: </span>
      <span className="max-w-48 truncate">{scope.label}</span>
    </Badge>
  )
}
