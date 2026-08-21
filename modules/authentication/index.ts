// Authentication Module — barrel exports

// Domain
export { User } from "./domain/user.entity";
export { Session } from "./domain/session.entity";
export { AUTH_ERRORS } from "./domain/auth.errors";
export type { AuthErrorCode } from "./domain/auth.errors";

// Application
export { login } from "./application/login";
export { register } from "./application/register";
export { getCurrentSession } from "./application/get-session";
export { logout } from "./application/logout";

// Infrastructure
export { auth } from "./infrastructure/better-auth";
export { authClient } from "./infrastructure/better-auth-client";
export { getSession } from "./infrastructure/session.helper";

// Presentation
export { default as LoginForm } from "./presentation/login-form";

// Validators
export { loginSchema } from "./validators/login.schema";
export type { LoginSchema } from "./validators/login.schema";
