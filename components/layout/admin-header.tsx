// components/layout/admin-header.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, Mic, LayoutGrid, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { authClient } from '@/lib/auth-client'

interface AdminHeaderProps {
  userName: string
  userEmail: string
  userRole: string
  userImage?: string | null
}

export function AdminHeader({ userName, userEmail, userRole, userImage }: AdminHeaderProps) {
  const router = useRouter()
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Kiri: Logo */}
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            LIM
          </div>
          <span className="hidden text-lg font-semibold tracking-tight text-foreground sm:block">
            Konsol Pusat
          </span>
        </Link>

        {/* Tengah: Global Search (⌘K) */}
        <button
          type="button"
          className="hidden h-10 flex-1 max-w-xl items-center gap-3 rounded-full border border-border bg-muted px-4 text-sm text-muted-foreground transition-colors hover:border-ring/60 hover:text-foreground md:flex"
          aria-label="Cari atau buka perintah"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Cari surat, pengurus, modul…</span>
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
          <Mic className="h-4 w-4" />
        </button>

        {/* Kanan: Aksi + Profil */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden text-muted-foreground hover:text-foreground sm:flex" aria-label="Aplikasi">
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" aria-label="Notifikasi">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" className="h-9 w-9 rounded-full p-0" aria-label="Menu profil" />}
            >
              <Avatar className="h-9 w-9 border border-border">
                {userImage && <AvatarImage src={userImage} alt={userName} />}
                <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                  <Badge variant="secondary" className="mt-1 w-fit bg-primary/10 text-primary">
                    {userRole.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/dashboard/pengguna" />}>
                <User className="mr-2 h-4 w-4 text-muted-foreground" /> Profil Saya
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
