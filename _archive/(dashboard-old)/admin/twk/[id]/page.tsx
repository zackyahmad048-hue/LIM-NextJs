import { notFound } from "next/navigation";

import { getTwkMemberById } from "@/modules/twk/queries/twk.query";
import { requireSession } from "@/modules/shared/infrastructure/require-session";

import { TwkDetailView } from "@/components/admin/twk/detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  await requireSession();

  const { id } = await params;
  const member = await getTwkMemberById(id);

  if (!member) notFound();

  return <TwkDetailView member={member} />;
}
