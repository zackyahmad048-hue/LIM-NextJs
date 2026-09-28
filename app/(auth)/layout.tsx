export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site flex min-h-dvh flex-col">
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="flex w-full max-w-md flex-col items-center">
          {children}
        </div>
      </main>
    </div>
  );
}
