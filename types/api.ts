// types/api.ts
export type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}
