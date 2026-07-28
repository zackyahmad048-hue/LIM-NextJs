export default function TestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="rounded-lg border bg-background p-4 text-center shadow-sm">
        <h1 className="text-base font-semibold">Test route aktif</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Route ini tidak mengakses database langsung.
        </p>
      </div>
    </main>
  );
}
