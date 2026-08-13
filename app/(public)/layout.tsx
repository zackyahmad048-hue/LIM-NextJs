import Navbar from "@/components/website/layout/navbar";
import Footer from "@/components/website/layout/footer";

import "@/app/typeset.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site flex min-h-dvh flex-col overflow-y-clip">
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
