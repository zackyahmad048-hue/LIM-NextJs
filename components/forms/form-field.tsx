export function FormField({ label, name, children, errors }: { label: string; name: string; children: React.ReactNode; errors?: Record<string, string[]> }) {
  const error = errors?.[name]?.[0]
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
