// Shared Kernel — domain
export { BaseEntity } from "./domain/base.entity";
export type { BaseEntityProps } from "./domain/base.entity";
export { BaseValueObject } from "./domain/base-value-object";
export { ok, err, isOk, isErr } from "./domain/result";
export type { Result } from "./domain/result";

// Shared Kernel — infrastructure
export { prisma } from "./infrastructure/prisma";
export { BaseRepository } from "./infrastructure/base.repository";

// Shared Kernel — utils
export { cn } from "./utils/cn";
export { slugify } from "./utils/slug";

// Shared Kernel — constants
export { APP } from "./constants/app";
