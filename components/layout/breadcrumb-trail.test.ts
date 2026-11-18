import { describe, it, expect } from 'vitest'
import { buildBreadcrumbs } from './breadcrumb-trail'

describe('buildBreadcrumbs', () => {
  it('returns only the root for /dashboard', () => {
    expect(buildBreadcrumbs('/dashboard')).toEqual([{ label: 'Dashboard', href: '/dashboard' }])
  })

  it('returns nothing outside the dashboard', () => {
    expect(buildBreadcrumbs('/artikel')).toEqual([])
  })

  it('does not link group-only segments', () => {
    expect(buildBreadcrumbs('/dashboard/safari/titik')).toEqual([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Safari Ramadan', href: null },
      { label: 'Titik Safari', href: '/dashboard/safari/titik' },
    ])
  })

  it('labels unknown dynamic segments as Detail', () => {
    const trail = buildBreadcrumbs('/dashboard/letters/clx123abc')
    expect(trail.map((item) => item.label)).toEqual(['Dashboard', 'Persuratan', 'Detail'])
    expect(trail[1].href).toBe('/dashboard/letters')
  })
})
