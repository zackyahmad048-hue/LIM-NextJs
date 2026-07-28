import { getSession } from "@/modules/authentication/infrastructure/session.helper";

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}
