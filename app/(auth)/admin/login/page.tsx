import LoginStage from "@/modules/authentication/presentation/login-stage";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh min-w-full flex-col items-center px-4">
      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center justify-center py-10">
        <LoginStage />
      </div>

      <footer className="relative z-10 w-full max-w-sm pb-6">
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Sekretariat Lembaga Ittihadul Muballighin
        </p>
      </footer>
    </main>
  );
}
