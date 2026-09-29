import PageTransition from "@/components/shared/page-transition";

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTransition className="flex h-full flex-col">
      {children}
    </PageTransition>
  );
}