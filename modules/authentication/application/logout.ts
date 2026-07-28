import { auth } from "../infrastructure/better-auth";

export async function logout(token: string) {
  await auth.api.signOut({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}
