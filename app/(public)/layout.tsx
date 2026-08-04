import Navbar from "@/components/website/layout/navbar";
import PrayerStrip from "@/components/website/layout/prayer-strip";
import Footer from "@/components/website/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site flex min-h-screen flex-col overflow-y-clip">
      <PrayerStrip />
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
