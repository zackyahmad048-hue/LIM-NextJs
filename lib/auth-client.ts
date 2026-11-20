// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'
import { apiKeyClient } from '@better-auth/api-key/client'

export const authClient = createAuthClient({
  plugins: [apiKeyClient()],
})

// Export helper functions untuk kemudahan
export const { signIn, signUp, signOut, useSession } = authClient