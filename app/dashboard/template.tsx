import { PageFade } from '@/components/motion/page-fade'

// Sama seperti app/(public)/template.tsx: konten halaman memudar masuk saat rute berubah,
// sementara sidebar dan topbar di layout tidak ikut berkedip.
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <PageFade>{children}</PageFade>
}
