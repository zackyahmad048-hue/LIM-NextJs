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
  Pencil,
  Download,
  MapPin,
  Users,
  Flag,
} from "lucide-react";

import type { OrgStructure } from "@/modules/cms/queries/structure.query";
import { saveStructureAction } from "@/modules/cms/presentation/structure.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/admin/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { PreviewDialog } from "./preview.dialog";

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
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editingRegional, setEditingRegional] = useState<string | null>(null);
  const [editingBranch, setEditingBranch] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  function updateOrg(field: string, value: string) {
    setData((prev) => ({
      ...prev,
      organization: { ...prev.organization, [field]: value },
    }));
  }

  function addCentralMember() {
    setData((prev) => ({
      ...prev,
      centralBoard: [
        ...prev.centralBoard,
        {
          id: uid(),
          name: "",
          position: "",
          image: "",
          sortOrder: prev.centralBoard.length + 1,
        },
      ],
    }));
  }

  function updateCentralMember(
    id: string,
    field: string,
    value: string | number,
  ) {
    setData((prev) => ({
      ...prev,
      centralBoard: prev.centralBoard.map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    }));
  }

  function removeCentralMember(id: string) {
    setData((prev) => ({
      ...prev,
      centralBoard: prev.centralBoard.filter((m) => m.id !== id),
    }));
  }

  function addRegionalBoard() {
    setData((prev) => ({
      ...prev,
      regionalBoards: [
        ...prev.regionalBoards,
        {
          id: uid(),
          province: "",
          name: "",
          members: [],
        },
      ],
    }));
  }

  function updateRegionalBoard(
    id: string,
    field: string,
    value: string | number,
  ) {
    setData((prev) => ({
      ...prev,
      regionalBoards: prev.regionalBoards.map((r) =>
        r.id === id ? { ...r, [field]: value } : r,
      ),
    }));
  }

  function removeRegionalBoard(id: string) {
    setData((prev) => ({
      ...prev,
      regionalBoards: prev.regionalBoards.filter((r) => r.id !== id),
    }));
  }

  function addRegionalMember(regionalId: string) {
    setData((prev) => ({
      ...prev,
      regionalBoards: prev.regionalBoards.map((r) =>
        r.id === regionalId
          ? {
              ...r,
              members: [
                ...r.members,
                {
                  id: uid(),
                  name: "",
                  position: "",
                  image: "",
                  sortOrder: r.members.length + 1,
                },
              ],
            }
          : r,
      ),
    }));
  }

  function removeRegionalMember(regionalId: string, memberId: string) {
    setData((prev) => ({
      ...prev,
      regionalBoards: prev.regionalBoards.map((r) =>
        r.id === regionalId
          ? {
              ...r,
              members: r.members.filter((m) => m.id !== memberId),
            }
          : r,
      ),
    }));
  }

  function addBranchBoard() {
    setData((prev) => ({
      ...prev,
      branchBoards: [
        ...prev.branchBoards,
        {
          id: uid(),
          province: "",
          regency: "",
          name: "",
          members: [],
        },
      ],
    }));
  }

  function updateBranchBoard(
    id: string,
    field: string,
    value: string | number,
  ) {
    setData((prev) => ({
      ...prev,
      branchBoards: prev.branchBoards.map((b) =>
        b.id === id ? { ...b, [field]: value } : b,
      ),
    }));
  }

  function removeBranchBoard(id: string) {
    setData((prev) => ({
      ...prev,
      branchBoards: prev.branchBoards.filter((b) => b.id !== id),
    }));
  }

  function addBranchMember(branchId: string) {
    setData((prev) => ({
      ...prev,
      branchBoards: prev.branchBoards.map((b) =>
        b.id === branchId
          ? {
              ...b,
              members: [
                ...b.members,
                {
                  id: uid(),
                  name: "",
                  position: "",
                  image: "",
                  sortOrder: b.members.length + 1,
                },
              ],
            }
          : b,
      ),
    }));
  }

  function removeBranchMember(branchId: string, memberId: string) {
    setData((prev) => ({
      ...prev,
      branchBoards: prev.branchBoards.map((b) =>
        b.id === branchId
          ? {
              ...b,
              members: b.members.filter((m) => m.id !== memberId),
            }
          : b,
      ),
    }));
  }

  function addMember() {
    setData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: uid(),
          name: "",
          position: "",
          image: "",
          sortOrder: prev.members.length + 1,
        },
      ],
    }));
  }

  function updateMember(id: string, field: string, value: string | number) {
    setData((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    }));
  }

  function removeMember(id: string) {
    setData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
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
          Atur struktur organisasi LIM: Pengurus Pusat, Pengurus
          Wilayah, Pengurus Cabang, dan Anggota.
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

        <div className="mt-4 space-y-2">
          <Label htmlFor="sheet-url">URL Google Sheet Anggota</Label>
          <div className="flex gap-2">
            <Input
              id="sheet-url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={data.googleSheetUrl}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  googleSheetUrl: e.target.value,
                }))
              }
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setPreviewOpen(true)}
              disabled={!data.googleSheetUrl.trim()}
            >
              <Download className="size-4" />
              Preview
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Sheet harus memiliki kolom: nama, alamat, kelas, pos,
            tempat. Data anggota diimpor dari sheet ini.
          </p>
        </div>
      </Section>

      <Section
        id="centralBoard"
        title="Pengurus Pusat"
        icon={Building2}
        expanded={expandedSection === "centralBoard"}
        badge={`${data.centralBoard.length} pengurus`}
        onToggle={setExpandedSection}
      >
        <div className="space-y-3">
          {data.centralBoard.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data Pengurus Pusat. Tambahkan pengurus
              pusat.
            </p>
          ) : (
            data.centralBoard.map((m) => (
              <div
                key={m.id}
                className="rounded-md border p-3"
              >
                {editingMember === m.id ? (
                  <div className="space-y-2">
                    <Input
                      value={m.name}
                      onChange={(e) =>
                        updateCentralMember(m.id, "name", e.target.value)
                      }
                      className="h-7 text-sm"
                      placeholder="Nama pengurus"
                    />
                    <Input
                      value={m.position}
                      onChange={(e) =>
                        updateCentralMember(
                          m.id,
                          "position",
                          e.target.value,
                        )
                      }
                      className="h-7 text-xs"
                      placeholder="Jabatan"
                    />
                    <Input
                      value={m.image}
                      onChange={(e) =>
                        updateCentralMember(m.id, "image", e.target.value)
                      }
                      className="h-7 text-xs"
                      placeholder="URL gambar"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setEditingMember(null)}
                      >
                        Selesai
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive"
                        onClick={() =>
                          removeCentralMember(m.id)
                        }
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
                        onClick={() => setEditingMember(m.id)}
                      >
                        {m.name || (
                          <span className="italic text-muted-foreground">
                            Nama pengurus
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.position || "Tanpa jabatan"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setEditingMember(m.id)}
                      aria-label="Edit anggota"
                    >
                      <Pencil className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
          <Button variant="outline" size="sm" onClick={addCentralMember}>
            <Plus className="size-4" />
            Tambah Pengurus Pusat
          </Button>
        </div>
      </Section>

      <Section
        id="regionalBoards"
        title="Pengurus Wilayah"
        icon={Flag}
        expanded={expandedSection === "regionalBoards"}
        badge={`${data.regionalBoards.length} wilayah`}
        onToggle={setExpandedSection}
      >
        <div className="space-y-3">
          {data.regionalBoards.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data Pengurus Wilayah. Tambahkan wilayah
              (provinsi).
            </p>
          ) : (
            data.regionalBoards.map((r) => (
              <div key={r.id} className="rounded-md border p-3">
                {editingRegional === r.id ? (
                  <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Provinsi</Label>
                        <Input
                          value={r.province}
                          onChange={(e) =>
                            updateRegionalBoard(
                              r.id,
                              "province",
                              e.target.value,
                            )
                          }
                          className="h-7 text-xs"
                          placeholder="Nama provinsi"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Nama
                        Pengurus</Label>
                        <Input
                          value={r.name}
                          onChange={(e) =>
                            updateRegionalBoard(
                              r.id,
                              "name",
                              e.target.value,
                            )
                          }
                          className="h-7 text-xs"
                          placeholder="Nama pengurus wilayah"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setEditingRegional(null)}
                      >
                        Selesai
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive"
                        onClick={() =>
                          removeRegionalBoard(r.id)
                        }
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
                        onClick={() => setEditingRegional(r.id)}
                      >
                        {r.province || (
                          <span className="italic text-muted-foreground">
                            Provinsi
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.name || "Tanpa nama"} ·{" "}
                        {r.members.length} anggota
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setEditingRegional(r.id)}
                      aria-label="Edit regional"
                    >
                      <Pencil className="size-3" />
                    </Button>
                  </div>
                )}

                {editingRegional !== r.id && (
                  <div className="mt-2 space-y-1.5">
                    {r.members.map((m) => (
                      <div
                        key={m.id}
                        className="group flex items-center justify-between rounded px-2 py-1 hover:bg-muted/50"
                      >
                        <span className="text-xs">
                          {m.name || (
                            <span className="italic text-muted-foreground">
                              Anggota
                            </span>
                          )}
                          {m.position && (
                            <span className="ml-2 text-[10px] text-muted-foreground">
                              — {m.position}
                            </span>
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-[10px] text-destructive"
                          onClick={() =>
                            removeRegionalMember(r.id, m.id)
                          }
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground"
                      onClick={() => addRegionalMember(r.id)}
                    >
                      <Plus className="size-3" />
                      Tambah anggota
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
          <Button variant="outline" size="sm" onClick={addRegionalBoard}>
            <Plus className="size-4" />
            Tambah Pengurus Wilayah
          </Button>
        </div>
      </Section>

      <Section
        id="branchBoards"
        title="Pengurus Cabang"
        icon={MapPin}
        expanded={expandedSection === "branchBoards"}
        badge={`${data.branchBoards.length} cabang`}
        onToggle={setExpandedSection}
      >
        <div className="space-y-3">
          {data.branchBoards.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data Pengurus Cabang. Tambahkan cabang
              (kabupaten/kota).
            </p>
          ) : (
            data.branchBoards.map((b) => (
              <div key={b.id} className="rounded-md border p-3">
                {editingBranch === b.id ? (
                  <div className="space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Provinsi</Label>
                        <Input
                          value={b.province}
                          onChange={(e) =>
                            updateBranchBoard(
                              b.id,
                              "province",
                              e.target.value,
                            )
                          }
                          className="h-7 text-xs"
                          placeholder="Nama provinsi"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Kabupaten/Kota</Label>
                        <Input
                          value={b.regency}
                          onChange={(e) =>
                            updateBranchBoard(
                              b.id,
                              "regency",
                              e.target.value,
                            )
                          }
                          className="h-7 text-xs"
                          placeholder="Nama kabupaten/kota"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs">Nama
                        Pengurus</Label>
                        <Input
                          value={b.name}
                          onChange={(e) =>
                            updateBranchBoard(
                              b.id,
                              "name",
                              e.target.value,
                            )
                          }
                          className="h-7 text-xs"
                          placeholder="Nama pengurus cabang"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setEditingBranch(null)}
                      >
                        Selesai
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive"
                        onClick={() =>
                          removeBranchBoard(b.id)
                        }
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
                        onClick={() => setEditingBranch(b.id)}
                      >
                        {b.regency || (
                          <span className="italic text-muted-foreground">
                            Kabupaten/Kota
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.province && `${b.province} · `}
                        {b.name || "Tanpa nama"} ·{" "}
                        {b.members.length} anggota
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setEditingBranch(b.id)}
                      aria-label="Edit cabang"
                    >
                      <Pencil className="size-3" />
                    </Button>
                  </div>
                )}

                {editingBranch !== b.id && (
                  <div className="mt-2 space-y-1.5">
                    {b.members.map((m) => (
                      <div
                        key={m.id}
                        className="group flex items-center justify-between rounded px-2 py-1 hover:bg-muted/50"
                      >
                        <span className="text-xs">
                          {m.name || (
                            <span className="italic text-muted-foreground">
                              Anggota
                            </span>
                          )}
                          {m.position && (
                            <span className="ml-2 text-[10px] text-muted-foreground">
                              — {m.position}
                            </span>
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 text-[10px] text-destructive"
                          onClick={() =>
                            removeBranchMember(b.id, m.id)
                          }
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground"
                      onClick={() => addBranchMember(b.id)}
                    >
                      <Plus className="size-3" />
                      Tambah anggota
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
          <Button variant="outline" size="sm" onClick={addBranchBoard}>
            <Plus className="size-4" />
            Tambah Pengurus Cabang
          </Button>
        </div>
      </Section>

      <Section
        id="members"
        title="Anggota"
        icon={Users}
        expanded={expandedSection === "members"}
        badge={`${data.members.length} anggota`}
        onToggle={setExpandedSection}
      >
        <div className="space-y-3">
          {data.members.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data anggota. Tambahkan anggota.
            </p>
          ) : (
            data.members.map((m) => (
              <div
                key={m.id}
                className="rounded-md border p-3"
              >
                {editingMember === m.id ? (
                  <div className="space-y-2">
                    <Input
                      value={m.name}
                      onChange={(e) =>
                        updateMember(m.id, "name", e.target.value)
                      }
                      className="h-7 text-sm"
                      placeholder="Nama anggota"
                    />
                    <Input
                      value={m.position}
                      onChange={(e) =>
                        updateMember(m.id, "position", e.target.value)
                      }
                      className="h-7 text-xs"
                      placeholder="Jabatan/posisi"
                    />
                    <Input
                      value={m.image}
                      onChange={(e) =>
                        updateMember(m.id, "image", e.target.value)
                      }
                      className="h-7 text-xs"
                      placeholder="URL gambar"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setEditingMember(null)}
                      >
                        Selesai
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive"
                        onClick={() => removeMember(m.id)}
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
                        onClick={() => setEditingMember(m.id)}
                      >
                        {m.name || (
                          <span className="italic text-muted-foreground">
                            Nama anggota
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.position || "Tanpa posisi"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => setEditingMember(m.id)}
                      aria-label="Edit anggota"
                    >
                      <Pencil className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
          <Button variant="outline" size="sm" onClick={addMember}>
            <Plus className="size-4" />
            Tambah Anggota
          </Button>
        </div>
      </Section>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        initialUrl={data.googleSheetUrl}
      />
    </div>
  );
}