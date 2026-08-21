import { describe, expect, it } from "vitest";

import {
  can,
  hasAllPermissions,
  hasAnyPermission,
  type PermissionMatrix,
} from "./permission.service";

const EDITOR = {
  "content.category.read": ["content.category.read"],
  "content.category.create": ["content.category.create"],
  "content.post.read": ["content.post.read"],
  "content.post.create": ["content.post.create"],
  "content.post.update": ["content.post.update"],
};

const MATRIX: PermissionMatrix = {
  "super-admin": "*",
  administrator: Object.keys(EDITOR).concat([
    "content.post.publish",
    "falak.prayer-time.view",
    "falak.prayer-time.generate",
    "secretariat.view",
  ]),
  editor: Object.values(EDITOR).flat(),
  viewer: ["content.post.read"],
};

describe("can()", () => {
  it("returns true when the role holds the exact permission", () => {
    expect(can("editor", "content.post.read", MATRIX)).toBe(true);
  });

  it("returns false when the role does not hold the permission", () => {
    expect(can("editor", "falak.prayer-time.view", MATRIX)).toBe(false);
  });

  it("returns true for any permission when the role maps to '*'", () => {
    expect(can("super-admin", "wajib-khidmah.view", MATRIX)).toBe(true);
  });

  it("returns false for a role absent from the matrix", () => {
    expect(can("ghost", "content.post.read", MATRIX)).toBe(false);
  });

  it("returns false for an empty permission string", () => {
    expect(can("editor", "", MATRIX)).toBe(false);
  });
});

describe("hasAnyPermission()", () => {
  it("returns true when one required permission is held", () => {
    expect(
      hasAnyPermission(["editor"], ["falak.qibla.view", "content.post.read"], MATRIX),
    ).toBe(true);
  });

  it("returns false when none of the required permissions is held", () => {
    expect(
      hasAnyPermission(["editor"], ["falak.qibla.view", "falak.eclipse.view"], MATRIX),
    ).toBe(false);
  });

  it("combines permissions across the user's roles", () => {
    expect(
      hasAnyPermission(["viewer", "editor"], ["content.post.create", "falak.qibla.view"], MATRIX),
    ).toBe(true);
  });

  it("returns false for a user with no roles", () => {
    expect(hasAnyPermission([], ["content.post.read"], MATRIX)).toBe(false);
  });

  it("returns false when the required list is empty", () => {
    expect(hasAnyPermission(["editor"], [], MATRIX)).toBe(false);
  });
});

describe("hasAllPermissions()", () => {
  it("returns true when every required permission is held", () => {
    expect(
      hasAllPermissions(["editor"], ["content.category.read", "content.post.read"], MATRIX),
    ).toBe(true);
  });

  it("returns false when at least one required permission is missing", () => {
    expect(
      hasAllPermissions(["editor"], ["content.post.read", "content.post.publish"], MATRIX),
    ).toBe(false);
  });

  it("distributes the burden across the user's roles", () => {
    expect(
      hasAllPermissions(
        ["viewer", "editor"],
        ["content.post.read", "content.post.create"],
        MATRIX,
      ),
    ).toBe(true);
  });

  it("returns true when the required list is empty", () => {
    expect(hasAllPermissions(["editor"], [], MATRIX)).toBe(true);
  });

  it("returns false for a user with no roles and required permissions", () => {
    expect(hasAllPermissions([], ["content.post.read"], MATRIX)).toBe(false);
  });
});
