import { Session } from "./session.entity";

export interface SessionRepository {
  findByToken(token: string): Promise<Session | null>;
  findActiveByUserId(userId: string): Promise<Session | null>;
  delete(token: string): Promise<void>;
}
