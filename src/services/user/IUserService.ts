import type { User } from "@/models/User.js";

interface IUserService {
  create(email: string, password: string): Promise<User>;

  findById(id: number): Promise<User>;

  findAll(): Promise<User[]>;

  update(
    id: number,
    data: Partial<{ email: string; password: string }>,
  ): Promise<User>;

  delete(id: number): Promise<User>;
}

export type { IUserService };
