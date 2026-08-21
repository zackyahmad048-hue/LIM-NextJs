import { auth } from "../infrastructure/better-auth";

export async function login(email: string, password: string) {
  const result = await auth.api.signInEmail({
    body: { email, password },
  });

  return result;
}
