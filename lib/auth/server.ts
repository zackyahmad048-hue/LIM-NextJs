import "server-only";

import { createNeonAuth } from "@neon/auth/next/server";

let auth: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !cookieSecret) {
    throw new Error("NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET must be set.");
  }
  return (auth ??= createNeonAuth({ baseUrl, cookies: { secret: cookieSecret } }));
}
