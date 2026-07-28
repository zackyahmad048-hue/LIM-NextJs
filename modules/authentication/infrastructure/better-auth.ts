import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";

import { prisma } from "@/modules/shared/infrastructure/prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  baseURL: process.env.BETTER_AUTH_URL!,
});
