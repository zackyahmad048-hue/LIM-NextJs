import { describe, expect, it } from "vitest";

import { PERMISSIONS } from "@/config/permission";

import { can } from "./permission.service";
import { DEFAULT_PERMISSION_MATRIX, flattenPermissions } from "./permission.matrix";

describe("flattenPermissions()", () => {
  it("collects every leaf string in a nested tree", () => {
    const tree = {
      A: { READ: "a.read", WRITE: "a.write" },
      B: "b.read",
      C: { D: { VIEW: "c.d.view" } },
    };

    expect(flattenPermissions(tree).sort()).toEqual(["a.read", "a.write", "b.read", "c.d.view"]);
  });

  it("returns an empty array for an empty tree", () => {
    expect(flattenPermissions({})).toEqual([]);
  });

  it("handles a single flat level", () => {
    expect(flattenPermissions({ A: "a.read" })).toEqual(["a.read"]);
  });
});

describe("DEFAULT_PERMISSION_MATRIX", () => {
  const allConfigSlugs = flattenPermissions(PERMISSIONS);

  it("grants super-admin every permission via '*'", () => {
    for (const slug of allConfigSlugs) {
      expect(can("super-admin", slug, DEFAULT_PERMISSION_MATRIX)).toBe(true);
    }
  });

  it("grants administrator every configured permission", () => {
    for (const slug of allConfigSlugs) {
      expect(can("administrator", slug, DEFAULT_PERMISSION_MATRIX)).toBe(true);
    }
  });

  it("gives editor content access but no falak access", () => {
    expect(can("editor", "content.post.read", DEFAULT_PERMISSION_MATRIX)).toBe(true);
    expect(can("editor", "content.post.publish", DEFAULT_PERMISSION_MATRIX)).toBe(true);
    expect(can("editor", "falak.prayer-time.view", DEFAULT_PERMISSION_MATRIX)).toBe(false);
    expect(can("editor", "program.view", DEFAULT_PERMISSION_MATRIX)).toBe(false);
  });

  it("gives operator falak and program access but no content write access", () => {
    expect(can("operator", "falak.prayer-time.generate", DEFAULT_PERMISSION_MATRIX)).toBe(true);
    expect(can("operator", "program.schedule.create", DEFAULT_PERMISSION_MATRIX)).toBe(true);
    expect(can("operator", "content.post.create", DEFAULT_PERMISSION_MATRIX)).toBe(false);
  });

  it("gives viewer read-only access", () => {
    expect(can("viewer", "content.post.read", DEFAULT_PERMISSION_MATRIX)).toBe(true);
    expect(can("viewer", "falak.prayer-time.view", DEFAULT_PERMISSION_MATRIX)).toBe(true);
    expect(can("viewer", "content.post.create", DEFAULT_PERMISSION_MATRIX)).toBe(false);
    expect(can("viewer", "falak.prayer-time.generate", DEFAULT_PERMISSION_MATRIX)).toBe(false);
  });

  it("covers every configured permission across the five roles", () => {
    const covered = new Set<string>();
    for (const role of Object.keys(DEFAULT_PERMISSION_MATRIX)) {
      const grants = DEFAULT_PERMISSION_MATRIX[role];
      if (grants === "*") continue;
      for (const slug of grants) covered.add(slug);
    }
    expect(covered.size).toBe(allConfigSlugs.length);
  });
});
