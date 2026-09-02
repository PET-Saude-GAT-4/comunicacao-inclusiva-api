import type { UserOutput, UserUpdateInput } from "@/models/types/User.type.js";

interface IUserService {
  create(
    email: string,
    password: string,
    roleId: number,
    currentUser?: { role: string },
  ): Promise<UserOutput>;

  findById(id: number): Promise<UserOutput | null>;

  findAll(): Promise<UserOutput[]>;

  update(
    id: number,
    data: UserUpdateInput,
    currentUser: { id: number; role: string },
  ): Promise<UserOutput>;

  delete(id: number, currentUser: { role: string }): Promise<void>;
}

export type { IUserService };
