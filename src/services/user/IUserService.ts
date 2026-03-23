import type { UserOutput, UserUpdateInput } from "@/models/types/User.type.js";

interface IUserService {
  create(email: string, password: string, roleId: number): Promise<UserOutput>;

  findById(id: number): Promise<UserOutput>;

  findAll(): Promise<UserOutput[]>;

  update(id: number, data: UserUpdateInput): Promise<UserOutput>;

  delete(id: number): Promise<void>;
}

export type { IUserService };
