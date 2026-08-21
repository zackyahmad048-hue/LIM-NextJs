import { User } from "./user.entity";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  countAll(): Promise<number>;
  create(data: {
    name: string;
    email: string;
    emailVerified?: boolean;
  }): Promise<User>;
}
