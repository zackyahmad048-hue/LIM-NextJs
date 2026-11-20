import type { Role } from '@/generated/client'
import type { AuthzContext, AuthzDecision, PermissionAction } from '../domain/permissions'
import { getLetterActionsForRole, getLetterScopeForRole } from '../domain/matrix'

export function checkLetterPermission(
  ctx: AuthzContext,
  action: PermissionAction
): AuthzDecision {
  const { subject } = ctx
  const allowedActions = getLetterActionsForRole(subject.role)
  if (!allowedActions.includes(action)) {
    return { allowed: false, reason: 'role_not_allowed' }
  }

  const scope = getLetterScopeForRole(subject.role)
  if (!scope) return { allowed: false, reason: 'scope_undefined' }

  if (scope === 'global') {
    return { allowed: true, scope }
  }

  // Org-scoped: PW/PC can only access their own organization data.
  if (scope === 'pw' || scope === 'pc') {
    if (!subject.organisasiId) {
      return { allowed: false, reason: 'missing_subject_org', scope }
    }
    if (ctx.resourceOrgId && ctx.resourceOrgId !== subject.organisasiId) {
      return { allowed: false, reason: 'cross_org_access', scope }
    }
    return { allowed: true, scope }
  }

  if (scope === 'self') {
    if (ctx.resourceOwnerId && ctx.resourceOwnerId !== subject.userId) {
      return { allowed: false, reason: 'not_owner', scope }
    }
    return { allowed: true, scope }
  }

  return { allowed: false, reason: 'unknown_scope' }
}

export function canRoleDo(role: Role, actions: PermissionAction[], action: PermissionAction): boolean {
  return actions.includes(action)
}

export function requireAllowed(decision: AuthzDecision): void {
  if (!decision.allowed) {
    const err = new Error(decision.reason ?? 'forbidden')
    ;(err as Error & { code?: string }).code = 'FORBIDDEN'
    throw err
  }
}
