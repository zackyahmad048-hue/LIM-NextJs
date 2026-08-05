"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";

import { saveSitePageContent } from "@/app/(dashboard)/admin/content/pages/_actions";
import type {
  SitePageDefinition,
  SitePageField,
} from "@/config/site-pages";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/admin/shared/section-card";

type Values = Record<string, unknown>;

interface PageEditorProps {
  def: SitePageDefinition;
  initialValues: Values;
}

function cloneValues(values: Values): Values {
  return JSON.parse(JSON.stringify(values)) as Values;
}

export function PageEditor({ def, initialValues }: PageEditorProps) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(() => cloneValues(initialValues));
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateSimpleList(field: SitePageField, index: number, text: string) {
    const list = (values[field.key] as string[]).slice();
    list[index] = text;
    setField(field.key, list);
  }

  function addSimpleItem(field: SitePageField) {
    setField(field.key, [...(values[field.key] as string[]), ""]);
  }

  function removeSimpleItem(field: SitePageField, index: number) {
    const list = (values[field.key] as string[]).slice();
    list.splice(index, 1);
    setField(field.key, list);
  }

  function updatePair(
    field: SitePageField,
    index: number,
    key: "title" | "description",
    text: string,
  ) {
    const list = (values[field.key] as { title: string; description: string }[]).slice();
    list[index] = { ...list[index], [key]: text };
    setField(field.key, list);
  }

  function addPairItem(field: SitePageField) {
    setField(field.key, [
      ...(values[field.key] as { title: string; description: string }[]),
      { title: "", description: "" },
    ]);
  }

  function removePairItem(field: SitePageField, index: number) {
    const list = (values[field.key] as { title: string; description: string }[]).slice();
    list.splice(index, 1);
    setField(field.key, list);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await saveSitePageContent(def.key, values);
      if (result.ok) {
        toast.success(`${def.title} berhasil disimpan.`);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Gagal menyimpan.");
    }
    setSaving(false);
  }

  const textFields = def.fields.filter(
    (field) => field.type === "text" || field.type === "textarea",
  );
  const listFields = def.fields.filter(
    (field) => field.type === "list-simple" || field.type === "list-pair",
  );

  return (
    <div className="flex flex-col gap-4">
      {textFields.length > 0 && (
        <SectionCard className="rounded-lg bg-background p-4 shadow-none">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Konten Teks</h2>
            <p className="text-xs text-muted-foreground">
              Judul dan paragraf yang ditampilkan pada halaman.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {textFields.map((field) =>
              field.type === "textarea" ? (
                <div key={field.key} className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={field.key} className="text-xs">
                    {field.label}
                  </Label>
                  <Textarea
                    id={field.key}
                    rows={field.rows}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-0 rounded-md text-xs leading-5"
                  />
                  {field.hint && (
                    <p className="text-[11px] text-muted-foreground">
                      {field.hint}
                    </p>
                  )}
                </div>
              ) : (
                <div key={field.key} className="space-y-1.5">
                  <Label htmlFor={field.key} className="text-xs">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="rounded-md text-xs"
                  />
                </div>
              ),
            )}
          </div>
        </SectionCard>
      )}

      {listFields.map((field) => (
        <SectionCard
          key={field.key}
          className="rounded-lg bg-background p-4 shadow-none"
        >
          <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
            <div>
              <h2 className="text-base font-semibold">{field.label}</h2>
              <p className="text-xs text-muted-foreground">
                Urutannya sesuai dengan tampilan pada halaman.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="shrink-0 rounded-full"
              onClick={() =>
                field.type === "list-simple"
                  ? addSimpleItem(field)
                  : addPairItem(field)
              }
            >
              <Plus className="size-4" />
              {field.addLabel ?? "Tambah"}
            </Button>
          </div>

          <div className="space-y-2.5">
            {(
              (values[field.key] as
                | string[]
                | { title: string; description: string }[]) ?? []
            ).map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-md border bg-muted/30 p-2.5"
              >
                {field.type === "list-simple" ? (
                  <>
                    <Input
                      value={String(item)}
                      onChange={(e) =>
                        updateSimpleList(field, index, e.target.value)
                      }
                      placeholder={field.itemLabel}
                      className="h-8 rounded-full text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeSimpleItem(field, index)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Hapus ${field.itemLabel} ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </>
                ) : (
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    {(() => {
                      const pair = item as { title: string; description: string };
                      return (
                        <>
                          <Input
                            value={pair.title}
                            onChange={(e) =>
                              updatePair(field, index, "title", e.target.value)
                            }
                            placeholder={field.titleLabel}
                            className="h-8 rounded-full text-xs"
                          />
                          <Input
                            value={pair.description}
                            onChange={(e) =>
                              updatePair(
                                field,
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder={field.descLabel}
                            className="h-8 rounded-full text-xs"
                          />
                        </>
                      );
                    })()}
                    <button
                      type="button"
                      onClick={() => removePairItem(field, index)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:col-span-2 sm:justify-self-end"
                      aria-label={`Hapus ${field.titleLabel} ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {(values[field.key] as unknown[]).length === 0 && (
              <p className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
                Belum ada item. Tekan {field.addLabel ?? "Tambah"} untuk
                menambahkan.
              </p>
            )}
          </div>
        </SectionCard>
      ))}

      <div className="sticky bottom-4 flex justify-end">
        <Button
          type="button"
          size="sm"
          className="rounded-full"
          onClick={handleSave}
          disabled={saving || !dirty}
        >
          <Save className="size-4" />
          {saving ? "Menyimpan..." : "Simpan halaman"}
        </Button>
      </div>
    </div>
  );
}
