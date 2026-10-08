/**
 * Unit test shell action (ADR-011): guard → validasi → handler → revalidate.
 * Pengujian memakai vi.mock pada modul guard & next/cache, tanpa DI.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/modules/authorization/application/permission.guard", () => ({
  requireSessionWithPermissions: vi.fn(),
}));

import { revalidatePath } from "next/cache";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { ActionError, defineAction } from "@/modules/shared/presentation/define-action";

const guardSuccess = {
  user: { id: "u1" },
  roleSlugs: ["admin"],
  permissionSlugs: ["structure.update"],
};

const schema = z.object({ name: z.string().min(3) });

describe("defineAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireSessionWithPermissions).mockResolvedValue(guardSuccess);
  });

  it("sukses: handler dipanggil dengan input tervalidasi, hasil { ok, data }, cache di-revalidate", async () => {
    const handler = vi.fn().mockResolvedValue("saved");
    const action = defineAction({
      permission: "structure.update",
      schema,
      revalidate: ["/admin", "/profil"],
      handler,
    });

    const result = await action({ name: "LIM" });

    expect(result).toEqual({ ok: true, data: "saved" });
    expect(handler).toHaveBeenCalledWith({ name: "LIM" }, guardSuccess);
    expect(requireSessionWithPermissions).toHaveBeenCalledWith(["structure.update"]);
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    expect(revalidatePath).toHaveBeenNthCalledWith(1, "/admin");
    expect(revalidatePath).toHaveBeenNthCalledWith(2, "/profil");
  });

  it("menolak tanpa memanggil handler saat input tidak valid", async () => {
    const handler = vi.fn();
    const action = defineAction({ permission: "structure.update", schema, handler });

    const result = await action({ name: "ab" });

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Input tidak valid.");
    expect(result.fieldErrors?.name).toBeTruthy();
    expect(handler).not.toHaveBeenCalled();
  });

  it("memetakan FORBIDDEN dari guard ke pesan izin", async () => {
    vi.mocked(requireSessionWithPermissions).mockRejectedValue(new Error("FORBIDDEN"));
    const action = defineAction({ permission: "structure.update", handler: vi.fn() });

    const result = await action({} as never);

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/tidak memiliki izin/i);
  });

  it("memetakan UNAUTHORIZED dari guard ke pesan sesi", async () => {
    vi.mocked(requireSessionWithPermissions).mockRejectedValue(new Error("UNAUTHORIZED"));
    const action = defineAction({ permission: "structure.update", handler: vi.fn() });

    const result = await action({} as never);

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Sesi tidak valid/i);
  });

  it("meneruskan pesan ActionError yang aman ke pengguna", async () => {
    const action = defineAction({
      permission: "structure.update",
      handler: async () => {
        throw new ActionError("Struktur tidak boleh kosong.");
      },
    });

    const result = await action({} as never);

    expect(result).toEqual({ ok: false, message: "Struktur tidak boleh kosong." });
  });

  it("meneruskan input apa adanya ke handler saat tidak ada schema", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    const action = defineAction({ permission: "structure.update", handler });

    const result = await action({ name: "LIM" });

    expect(result.ok).toBe(true);
    expect(handler).toHaveBeenCalledWith({ name: "LIM" }, guardSuccess);
  });

  it("memicu revalidatePath sekali saat revalidate berupa string tunggal", async () => {
    const action = defineAction({
      permission: "structure.update",
      revalidate: "/admin",
      handler: async () => undefined,
    });

    await action({} as never);

    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
  });

  it("tidak menyentuh revalidatePath saat revalidate tidak diisi", async () => {
    const action = defineAction({ permission: "structure.update", handler: async () => undefined });

    await action({} as never);

    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("memetakan error pada root schema ke fieldErrors._form", async () => {
    const rootSchema = z.string().min(3);
    const action = defineAction({ permission: "structure.update", schema: rootSchema, handler: vi.fn() });

    const result = await action("ab" as never);

    expect(result.ok).toBe(false);
    expect(result.fieldErrors?._form).toBeTruthy();
  });

  it("mencatat error tak dikenal sebelum mengembalikannya ke pengguna", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const action = defineAction({
      permission: "structure.update",
      handler: async () => {
        throw new Error("db connection lost");
      },
    });

    const result = await action({} as never);

    expect(result.ok).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("menyembunyikan error tak dikenal di balik pesan umum", async () => {
    const action = defineAction({
      permission: "structure.update",
      handler: async () => {
        throw new Error("connection string bocor");
      },
    });

    const result = await action({} as never);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("Terjadi kesalahan.");
  });
});
