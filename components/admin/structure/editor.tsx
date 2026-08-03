"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2,
  Plus,
  Save,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
} from "lucide-react";

import type { OrgStructure } from "@/modules/cms/queries/structure.query";
import { saveStructureAction } from "@/app/(dashboard)/admin/structure/_actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/admin/shared/section-card";
import { Badge } from "@/components/ui/badge";

function Section({
  id,
  title,
  icon: Icon,
  expanded,
  badge,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  expanded: boolean;
  badge: string;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <SectionCard className="rounded-lg bg-background p-0 shadow-none overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        {badge && (
          <Badge variant="secondary" className="text-[11px]">
            {badge}
          </Badge>
        )}
      </button>
      {expanded && <div className="border-t px-4 py-3">{children}</div>}
    </SectionCard>
  );
}

interface Props {
  initial: OrgStructure;
}

let nextId = 100;

function uid() {
  return `id_${nextId++}_${Date.now()}`;
}

export function StructureEditor({ initial }: Props) {
  const router = useRouter();
  const [data, setData] = useState<OrgStructure>(() =>
    structuredClone(initial),
  );
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] =
    useState<string>("organization");
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [editingPos, setEditingPos] = useState<string | null>(null);
  const [editingMgt, setEditingMgt] = useState<string | null>(null);

  function updateOrg(field: string, value: string) {
    setData((prev) => ({
      ...prev,
      organization: { ...prev.organization, [field]: value },
    }));
  }

  function addDepartment() {
    setData((prev) => ({
      ...prev,
      departments: [
        ...prev.departments,
        {
          id: uid(),
          name: "",
          description: "",
          sortOrder: prev.departments.length + 1,
        },
      ],
    }));
  }

  function updateDepartment(id: string, field: string, value: string | number) {
    setData((prev) => ({
      ...prev,
      departments: prev.departments.map((d) =>
        d.id === id ? { ...d, [field]: value } : d,
      ),
    }));
  }

  function removeDepartment(id: string) {
    setData((prev) => ({
      ...prev,
      departments: prev.departments.filter((d) => d.id !== id),
      positions: prev.positions.filter((p) => p.departmentId !== id),
    }));
  }

  function addPosition(deptId: string) {
    setData((prev) => ({
      ...prev,
      positions: [
        ...prev.positions,
        {
          id: uid(),
          departmentId: deptId,
          name: "",
          level: 1,
          sortOrder:
            prev.positions.filter((p) => p.departmentId === deptId).length + 1,
        },
      ],
    }));
  }

  function updatePosition(id: string, field: string, value: string | number) {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  }

  function removePosition(id: string) {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.filter((p) => p.id !== id),
      management: prev.management.filter((m) => m.positionId !== id),
    }));
  }

  function addManagement(positionId: string) {
    setData((prev) => ({
      ...prev,
      management: [
        ...prev.management,
        { id: uid(), name: "", positionId, description: "", image: "" },
      ],
    }));
  }

  function updateManagement(id: string, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      management: prev.management.map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    }));
  }

  function removeManagement(id: string) {
    setData((prev) => ({
      ...prev,
      management: prev.management.filter((m) => m.id !== id),
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await saveStructureAction(data);
      if (result.ok) {
        toast.success("Struktur organisasi berhasil disimpan.");
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Atur struktur organisasi, bidang, jabatan, dan pengurus.
        </p>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          <Save className="size-4" />
          {saving ? "Menyimpan..." : "Simpan semua"}
        </Button>
      </div>

      <Section
        id="organization"
        title="Informasi Organisasi"
        icon={Building2}
        expanded={expandedSection === "organization"}
        badge=""
        onToggle={setExpandedSection}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nama organisasi</Label>
            <Input
              value={data.organization.name}
              onChange={(e) => updateOrg("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Singkatan</Label>
            <Input
              value={data.organization.shortName}
              onChange={(e) => updateOrg("shortName", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Alamat</Label>
            <Textarea
              rows={2}
              value={data.organization.address}
              onChange={(e) => updateOrg("address", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Telepon</Label>
            <Input
              value={data.organization.phone}
              onChange={(e) => updateOrg("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={data.organization.email}
              onChange={(e) => updateOrg("email", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Website</Label>
            <Input
              value={data.organization.website}
              onChange={(e) => updateOrg("website", e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section
        id="departments"
        title="Bidang / Divisi"
        icon={Building2}
        expanded={expandedSection === "departments"}
        badge={`${data.departments.length} bidang`}
        onToggle={setExpandedSection}
      >
        <div className="space-y-3">
          {data.departments.map((dept) => (
            <div key={dept.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
                    {editingDept === dept.id ? (
                      <Input
                        value={dept.name}
                        onChange={(e) =>
                          updateDepartment(dept.id, "name", e.target.value)
                        }
                        className="h-7 text-sm"
                        placeholder="Nama bidang"
                      />
                    ) : (
                      <span
                        className="text-sm font-medium cursor-pointer hover:text-orange-600"
                        onClick={() => setEditingDept(dept.id)}
                      >
                        {dept.name || (
                          <span className="italic text-muted-foreground">
                            Klik untuk isi nama
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  {editingDept === dept.id && (
                    <div className="space-y-2 pl-6">
                      <Textarea
                        rows={2}
                        value={dept.description}
                        onChange={(e) =>
                          updateDepartment(
                            dept.id,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Deskripsi bidang"
                        className="text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Urutan:</Label>
                        <Input
                          type="number"
                          value={dept.sortOrder}
                          onChange={(e) =>
                            updateDepartment(
                              dept.id,
                              "sortOrder",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="h-7 w-20 text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setEditingDept(null)}
                        >
                          Selesai
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive"
                          onClick={() => removeDepartment(dept.id)}
                        >
                          <Trash2 className="size-3" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {editingDept !== dept.id && (
                <div className="mt-2 space-y-1.5 pl-6">
                  {data.positions
                    .filter((p) => p.departmentId === dept.id)
                    .map((pos) => (
                      <div
                        key={pos.id}
                        className="group flex items-center justify-between rounded px-2 py-1 hover:bg-muted/50"
                      >
                        {editingPos === pos.id ? (
                          <div className="flex-1 space-y-1">
                            <Input
                              value={pos.name}
                              onChange={(e) =>
                                updatePosition(pos.id, "name", e.target.value)
                              }
                              className="h-7 text-xs"
                              placeholder="Nama jabatan"
                            />
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Level:</Label>
                              <Input
                                type="number"
                                value={pos.level}
                                onChange={(e) =>
                                  updatePosition(
                                    pos.id,
                                    "level",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className="h-7 w-16 text-xs"
                              />
                              <Label className="text-xs">Urutan:</Label>
                              <Input
                                type="number"
                                value={pos.sortOrder}
                                onChange={(e) =>
                                  updatePosition(
                                    pos.id,
                                    "sortOrder",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className="h-7 w-16 text-xs"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => setEditingPos(null)}
                              >
                                OK
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-destructive"
                                onClick={() => removePosition(pos.id)}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span
                              className="text-xs cursor-pointer hover:text-orange-600"
                              onClick={() => setEditingPos(pos.id)}
                            >
                              {pos.name || (
                                <span className="italic text-muted-foreground">
                                  Jabatan
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                              {data.management
                                .filter((m) => m.positionId === pos.id)
                                .slice(0, 2)
                                .map((m) => (
                                  <Badge
                                    key={m.id}
                                    variant="outline"
                                    className="text-[10px] h-5"
                                  >
                                    {m.name || "?"}
                                  </Badge>
                                ))}
                              {data.management.filter(
                                (m) => m.positionId === pos.id,
                              ).length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] h-5"
                                >
                                  +
                                  {data.management.filter(
                                    (m) => m.positionId === pos.id,
                                  ).length - 2}
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-5"
                                onClick={() => addManagement(pos.id)}
                              >
                                <Plus className="size-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground"
                    onClick={() => addPosition(dept.id)}
                  >
                    <Plus className="size-3" />
                    Tambah jabatan
                  </Button>
                </div>
              )}
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addDepartment}>
            <Plus className="size-4" />
            Tambah bidang
          </Button>
        </div>
      </Section>

      <Section
        id="management"
        title="Pengurus"
        icon={Building2}
        expanded={expandedSection === "management"}
        badge={`${data.management.length} pengurus`}
        onToggle={setExpandedSection}
      >
        <div className="space-y-3">
          {data.management.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data pengurus. Tambahkan jabatan dan isi pengurusnya.
            </p>
          ) : (
            data.management.map((mgt) => {
              const pos = data.positions.find((p) => p.id === mgt.positionId);
              const dept = data.departments.find(
                (d) => d.id === pos?.departmentId,
              );
              return (
                <div key={mgt.id} className="rounded-md border p-3">
                  {editingMgt === mgt.id ? (
                    <div className="space-y-2">
                      <Input
                        value={mgt.name}
                        onChange={(e) =>
                          updateManagement(mgt.id, "name", e.target.value)
                        }
                        className="h-7 text-sm"
                        placeholder="Nama pengurus"
                      />
                      <Input
                        value={mgt.description}
                        onChange={(e) =>
                          updateManagement(
                            mgt.id,
                            "description",
                            e.target.value,
                          )
                        }
                        className="h-7 text-xs"
                        placeholder="Deskripsi"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setEditingMgt(null)}
                        >
                          Selesai
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive"
                          onClick={() => removeManagement(mgt.id)}
                        >
                          <Trash2 className="size-3" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium cursor-pointer hover:text-orange-600"
                          onClick={() => setEditingMgt(mgt.id)}
                        >
                          {mgt.name || (
                            <span className="italic text-muted-foreground">
                              Nama pengurus
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pos?.name || "Tanpa jabatan"}
                          {dept ? ` — ${dept.name}` : ""}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setEditingMgt(mgt.id)}
                      >
                        <Pencil className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Section>
    </div>
  );
}
