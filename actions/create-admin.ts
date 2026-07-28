"use server";

import { auth } from "@/modules/authentication/infrastructure/better-auth";

export async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.");
  }

  await auth.api.signUpEmail({
    body: {
      name: "Super Admin",
      email,
      password,
    },
  });
}
