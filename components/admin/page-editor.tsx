"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import Image from "next/image";

import { saveSitePageContent } from "@/app/(dashboard)/admin/content/pages/_actions";
import type { SitePageDefinition, SitePageField } from "@/config/site-pages";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Band } from "@/components/admin/shared/band";
import { cn } from "@/lib/utils";

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
  const [values, setValues] = useState<Values>(() =>
    cloneValues(initialValues),
  );
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
    const list = (
      values[field.key] as { title: string; description: string }[]
    ).slice();
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
    const list = (
      values[field.key] as { title: string; description: string }[]
    ).slice();
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
    (field) => field.type === "text" || field.type === "textarea" || field.type === "image",
  );
  const listFields = def.fields.filter(
    (field) => field.type === "list-simple" || field.type === "list-pair",
  );

  return (
    <div className="flex flex-col gap-4">
      {textFields.length > 0 && (
        <Band
          variant="raised"
          title="Konten Teks"
          description="Judul dan paragraf yang ditampilkan pada halaman."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {textFields.map((field) =>
              field.type === "textarea" ? (
                <div key={field.key} className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={field.key} className="text-xs text-admin-content-fg/70">
                    {field.label}
                  </Label>
                  <Textarea
                    id={field.key}
                    rows={field.rows}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-0 rounded-md text-xs leading-5 bg-admin-input-bg border-admin-input-border text-admin-content-fg placeholder:text-admin-content-fg/60 focus:border-primary focus:ring-primary/20"
                  />
                  {field.hint && (
                    <p className="text-[11px] text-admin-content-fg/60">
                      {field.hint}
                    </p>
                  )}
                </div>
              ) : field.type === "image" ? (
                <div key={field.key} className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={field.key} className="text-xs text-admin-content-fg/70">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder ?? "/images/nama-file.jpg"}
                    className="rounded-md text-xs bg-admin-input-bg border-admin-input-border text-admin-content-fg placeholder:text-admin-content-fg/60 focus:border-primary focus:ring-primary/20"
                  />
                  {String(values[field.key] ?? "").trim() ? (
                    <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border bg-admin-input-bg">
                      <Image
                        src={String(values[field.key] ?? "")}
                        alt="Pratinjau gambar"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-[11px] text-admin-content-fg/60">
                      Kosong — section hanya akan menampilkan teks.
                    </p>
                  )}
                  {field.hint && (
                    <p className="text-[11px] text-admin-content-fg/60">
                      {field.hint}
                    </p>
                  )}
                </div>
              ) : (
                <div key={field.key} className="space-y-1.5">
                  <Label htmlFor={field.key} className="text-xs text-admin-content-fg/70">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="rounded-md text-xs bg-admin-input-bg border-admin-input-border text-admin-content-fg placeholder:text-admin-content-fg/60 focus:border-primary focus:ring-primary/20"
                  />
                </div>
              ),
            )}
          </div>
        </Band>
      )}

      {listFields.map((field) => (
        <Band
          key={field.key}
          variant="raised"
          title={field.label}
          description="Urutannya sesuai dengan tampilan pada halaman."
          actions={
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="shrink-0 rounded-full border-admin-border hover:bg-admin-border"
              onClick={() =>
                field.type === "list-simple"
                  ? addSimpleItem(field)
                  : addPairItem(field)
              }
            >
              <Plus className="size-4" />
              {field.addLabel ?? "Tambah"}
            </Button>
          }
        >
          <div className="space-y-2.5">
            {(
              (values[field.key] as
                string[] | { title: string; description: string }[]) ?? []
            ).map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2 rounded-md border p-2.5",
                  "bg-admin-border/30 border-admin-border",
                )}
              >
                {field.type === "list-simple" ? (
                  <>
                    <Input
                      value={String(item)}
                      onChange={(e) =>
                        updateSimpleList(field, index, e.target.value)
                      }
                      placeholder={field.itemLabel}
                      className="h-8 rounded-full text-xs bg-admin-input-bg border-admin-input-border text-admin-content-fg placeholder:text-admin-content-fg/60 focus:border-primary focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeSimpleItem(field, index)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-admin-content-fg/60 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      aria-label={`Hapus ${field.itemLabel} ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </>
                ) : (
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    {(() => {
                      const pair = item as {
                        title: string;
                        description: string;
                      };
                      return (
                        <>
                          <Input
                            value={pair.title}
                            onChange={(e) =>
                              updatePair(field, index, "title", e.target.value)
                            }
                            placeholder={field.titleLabel}
                            className="h-8 rounded-full text-xs bg-admin-input-bg border-admin-input-border text-admin-content-fg placeholder:text-admin-content-fg/60 focus:border-primary focus:ring-primary/20"
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
                            className="h-8 rounded-full text-xs bg-admin-input-bg border-admin-input-border text-admin-content-fg placeholder:text-admin-content-fg/60 focus:border-primary focus:ring-primary/20"
                          />
                        </>
                      );
                    })()}
                    <button
                      type="button"
                      onClick={() => removePairItem(field, index)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-admin-content-fg/60 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:col-span-2 sm:justify-self-end"
                      aria-label={`Hapus ${field.titleLabel} ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {(values[field.key] as unknown[]).length === 0 && (
              <p
                className={cn(
                  "rounded-md border p-4 text-center text-xs",
                  "border-admin-border/50 bg-admin-border/30 text-admin-content-fg/60",
                )}
              >
                Belum ada item. Tekan {field.addLabel ?? "Tambah"} untuk
                menambahkan.
              </p>
            )}
          </div>
        </Band>
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
