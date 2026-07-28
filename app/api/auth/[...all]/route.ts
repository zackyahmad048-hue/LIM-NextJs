import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/modules/authentication/infrastructure/better-auth";

export const { GET, POST } = toNextJsHandler(auth);