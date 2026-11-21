import { ApiReference } from '@scalar/nextjs-api-reference'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import type { Role } from '@/generated/client'

const INTERNAL_ROLES: Role[] = [
  'OWNER',
  'ADMIN_SEKRETARIAT',
  'TIM_WAJIB_KHIDMAH',
  'CONTENT_MANAGER',
  'ADMIN_BIDANG_SAFARI',
  'ADMIN_BIDANG_PESANTREN_RAMADAN',
  'PW',
  'PC',
]

async function loadSpec() {
  const specPath = path.join(process.cwd(), 'openapi', 'v1.json')
  const raw = await readFile(specPath, 'utf8')
  return JSON.parse(raw) as Record<string, unknown>
}

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', '/docs/api')
    return NextResponse.redirect(loginUrl)
  }

  const role = session.user.role as Role
  if (!INTERNAL_ROLES.includes(role)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }

  const spec = await loadSpec()
  const handler = ApiReference({
    content: spec,
    pageTitle: 'LIM API v1',
    theme: 'default',
    layout: 'modern',
  })
  return handler()
}
