import { auth } from "../infrastructure/better-auth";

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const result = await auth.api.signUpEmail({
    body: data,
  });

  return result;
}
