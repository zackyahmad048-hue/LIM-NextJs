// proxy.ts — Next.js 16 route protection (replaces middleware.ts)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const protectedRoutes = ['/dashboard', '/admin', '/profile']

const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['OWNER', 'ADMIN_SEKRETARIAT', 'TIM_WAJIB_KHIDMAH', 'CONTENT_MANAGER', 'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN'],
  '/admin/safari': ['OWNER', 'ADMIN_BIDANG_SAFARI'],
  '/admin/pesantren': ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN'],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  if (!isProtected) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api).*)'],
}