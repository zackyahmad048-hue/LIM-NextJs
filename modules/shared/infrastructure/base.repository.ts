import { prisma } from "./prisma";

export abstract class BaseRepository {
  protected readonly db = prisma;
}
