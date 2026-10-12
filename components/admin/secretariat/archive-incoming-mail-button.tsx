"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";

import { archiveIncomingMail } from "@/modules/secretariat/presentation/secretariat.action";

interface ArchiveIncomingMailButtonProps {
  id: string;
  subject: string;
  label?: string;
  variant?: "ghost" | "outline";
  className?: string;
}

export function ArchiveIncomingMailButton({
  id,
  subject,
  label,
  variant = "ghost",
  className,
}: ArchiveIncomingMailButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="sm"
        aria-label="Arsipkan surat masuk"
        className={className}
        onClick={() => setOpen(true)}
      >
        <Archive className="size-3.5" />
        {label}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Arsipkan surat masuk"
        description={`Surat masuk "${subject}" akan dipindahkan ke Arsip.`}
        onConfirm={async () => {
          const result = await archiveIncomingMail(id);

          if (result?.success) {
            toast.success("Surat masuk diarsipkan.");
            setOpen(false);
            router.refresh();
          } else {
            toast.error(result?.message ?? "Gagal mengarsipkan surat masuk.");
          }
        }}
      />
    </>
  );
}
