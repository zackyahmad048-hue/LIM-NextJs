"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { savePageContent } from "@/app/(dashboard)/admin/content/pages/_actions";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/admin/shared/section-card";

interface PageFormProps {
  pageKey: string;
  title: string;
  initialContent: string;
}

export function PageForm({ pageKey, title, initialContent }: PageFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const result = await savePageContent(pageKey, content);
      if (result.ok) {
        toast.success(`${title} berhasil disimpan.`);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Gagal menyimpan.");
    }
    setSaving(false);
  }

  return (
    <SectionCard className="rounded-lg bg-background p-4 shadow-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || content === initialContent}
        >
          <Save className="size-4" />
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
      <div className="mt-3 space-y-2">
        <Label>Konten</Label>
        <Textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Tulis konten ${title} di sini...`}
          className="font-mono text-sm"
        />
      </div>
    </SectionCard>
  );
}
