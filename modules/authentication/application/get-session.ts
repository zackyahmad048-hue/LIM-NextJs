import { getSession } from "../infrastructure/session.helper";

export async function getCurrentSession() {
  const session = await getSession();
  return session;
}
