import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/modules/authentication/presentation/login-form";
import Reveal from "@/components/website/motion/reveal";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh min-w-full flex-col items-center bg-background px-4">
      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center justify-center py-10">
        <Reveal from="scale" immediate className="w-full">
          <Card className="glass rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="mb-5 text-center">
                <Image
                  src="/images/orangelim.png"
                  alt="Logo Lembaga Ittihadul Muballighin"
                  width={48}
                  height={48}
                  priority
                  className="mx-auto"
                />

                <h1 className="mt-3 font-heading text-2xl font-medium text-balance text-card-foreground">
                  Admin Gateway
                </h1>

                <p className="mt-1.5 font-data text-[11px] uppercase text-muted-foreground">
                  Lembaga Ittihadul Muballighin
                </p>
              </div>

              <LoginForm />
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <footer className="relative z-10 w-full max-w-sm pb-6">
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Sekretariat Lembaga Ittihadul Muballighin
        </p>
      </footer>
    </main>
  );
}
