'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import type { NavGroup } from '@/components/layout/nav-config'

// Drawer navigasi untuk layar < md. Menutup sendiri setelah pengguna memilih menu.
export function MobileNav({ groups, accountGroups }: { groups: NavGroup[]; accountGroups: NavGroup[] }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Buka menu navigasi"
            className="size-11 md:hidden"
          >
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-72 bg-sidebar text-sidebar-foreground">
        <SheetHeader className="border-b border-sidebar-border">
          <SheetTitle className="flex items-center gap-3">
            <Image src="/logo_lim.svg" alt="" width={28} height={31} unoptimized />
            <span className="text-sm font-semibold tracking-tight">LIM Platform</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Menu navigasi dashboard</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
          <SidebarNav groups={groups} variant="drawer" onNavigate={close} label="Menu dashboard" />
          {accountGroups.length > 0 && (
            <div className="mt-auto border-t border-sidebar-border pt-3">
              <SidebarNav
                groups={accountGroups}
                variant="drawer"
                onNavigate={close}
                label="Menu akun"
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
