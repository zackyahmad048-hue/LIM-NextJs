import PageTransition from "@/components/shared/page-transition";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition className="flex flex-1 flex-col">{children}</PageTransition>;
}