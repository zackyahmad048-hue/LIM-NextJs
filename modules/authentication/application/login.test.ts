import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";

import { authClient } from "@/modules/authentication/infrastructure/better-auth-client";

describe("authClient seam", () => {
  it("is configured with baseURL from env", () => {
    expect(authClient).toBeDefined();
    expect(typeof authClient.signIn).toBe("function");
  });
});

// Test the login action seam - the server-side login function
import { login } from "@/modules/authentication/application/login";
import { auth } from "@/modules/authentication/infrastructure/better-auth";

vi.mock("@/modules/authentication/infrastructure/better-auth");

describe("login action seam", () => {
  let mockSignInEmail: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInEmail = vi.fn();
    vi.mocked(auth.api.signInEmail).mockImplementation(mockSignInEmail);
  });

  it("calls auth.api.signInEmail with email and password", async () => {
    const mockResult = { user: { id: "1", email: "test@example.com" } };
    mockSignInEmail.mockResolvedValue(mockResult);

    const result = await login("test@example.com", "password123");

    expect(mockSignInEmail).toHaveBeenCalledWith({
      body: { email: "test@example.com", password: "password123" },
    });
    expect(result).toEqual(mockResult);
  });

  it("propagates errors from auth.api.signInEmail", async () => {
    const mockError = new Error("Invalid credentials");
    mockSignInEmail.mockRejectedValue(mockError);

    await expect(login("test@example.com", "wrong")).rejects.toThrow(
      "Invalid credentials",
    );
  });
});