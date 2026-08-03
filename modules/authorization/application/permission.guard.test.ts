import { describe, expect, it } from "vitest";

import { DEFAULT_PERMISSION_MATRIX } from "./permission.matrix";
import { assertPermissions } from "./permission.guard";

describe("assertPermissions()", () => {
  it("throws UNAUTHORIZED for an unauthenticated user (no roles)", () => {
    expect(() => assertPermissions([], ["content.post.read"], DEFAULT_PERMISSION_MATRIX)).toThrow(
      "UNAUTHORIZED",
    );
  });

  it("throws UNAUTHORIZED before any permission check when roles are empty", () => {
    expect(() => assertPermissions([], [], DEFAULT_PERMISSION_MATRIX)).toThrow("UNAUTHORIZED");
  });

  it("allows any authenticated user when nothing is required", () => {
    expect(() => assertPermissions(["viewer"], [], DEFAULT_PERMISSION_MATRIX)).not.toThrow();
  });

  it("throws FORBIDDEN when the user lacks every required permission", () => {
    expect(() =>
      assertPermissions(["editor"], ["falak.prayer-time.generate"], DEFAULT_PERMISSION_MATRIX),
    ).toThrow("FORBIDDEN");
  });

  it("allows the user when they hold at least one required permission", () => {
    expect(() =>
      assertPermissions(
        ["editor"],
        ["content.post.read", "falak.prayer-time.generate"],
        DEFAULT_PERMISSION_MATRIX,
      ),
    ).not.toThrow();
  });

  it("combines permissions across a user's roles", () => {
    expect(() =>
      assertPermissions(
        ["viewer", "operator"],
        ["falak.prayer-time.generate"],
        DEFAULT_PERMISSION_MATRIX,
      ),
    ).not.toThrow();
  });
});
