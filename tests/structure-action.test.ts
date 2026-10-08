/**
 * Integrasi saveStructureAction (ADR-011 shell) dengan skema zod struktur.
 * Guard, cache, dan penyimpanan dimock per ADR — yang diuji adalah
 * permission gating, validasi skema, dan pemanggilan saveStructure.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/modules/authorization/application/permission.guard", () => ({
  requireSessionWithPermissions: vi.fn(),
}));

vi.mock("@/modules/cms/queries/structure.query", () => ({
  saveStructure: vi.fn(),
}));

import { revalidatePath } from "next/cache";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { saveStructure } from "@/modules/cms/queries/structure.query";
import { saveStructureAction } from "@/modules/cms/presentation/structure.action";

const structure = {
  organization: {
    name: "Lembaga Ittihadul Muballighin",
    shortName: "LIM",
    logo: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  },
  googleSheetUrl: "",
  centralBoard: [],
  regionalBoards: [],
  branchBoards: [],
  members: [],
};

describe("saveStructureAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireSessionWithPermissions).mockResolvedValue({
      user: { id: "u1" },
      roleSlugs: ["admin"],
      permissionSlugs: ["structure.update"],
    });
  });

  it("menyimpan struktur valid tanpa membocorkan role", async () => {
    const result = await saveStructureAction(structure);

    expect(result.ok).toBe(true);
    expect(saveStructure).toHaveBeenCalledTimes(1);
    expect(requireSessionWithPermissions).toHaveBeenCalledWith(["structure.update"]);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/profil/pengurus-pusat");
  });

  it("menolak payload tanpa melewati guard bila skema gagal", async () => {
    const payload = { ...structure, organization: { ...structure.organization, name: "" } };

    const result = await saveStructureAction(payload as typeof structure);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Input tidak valid.");
    expect(result.fieldErrors?.["organization.name"]).toBeTruthy();
    expect(saveStructure).not.toHaveBeenCalled();
  });

  it("menolak payload yang bukan bentuk struktur (key hilang)", async () => {
    const broken = { ...structure, members: [{ id: "x" }] };

    const result = await saveStructureAction(broken as never);

    expect(result.ok).toBe(false);
    expect(result.fieldErrors?.["members.0.name"]).toBeTruthy();
    expect(saveStructure).not.toHaveBeenCalled();
  });
});
