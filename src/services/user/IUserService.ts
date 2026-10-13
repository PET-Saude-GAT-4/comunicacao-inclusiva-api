import type { UserOutput, UserUpdateInput } from "@/models/types/User.type.js";
import type { ListQuery, Page } from "@/utils/pagination.js";

interface IUserService {
  create(
    email: string,
    roleId: number,
    currentUser?: { role: string },
  ): Promise<UserOutput>;

  findById(id: number): Promise<UserOutput | null>;

  findByUuid(uuid: string): Promise<UserOutput | null>;

  findAll(): Promise<UserOutput[]>;

  findPage(query: ListQuery): Promise<Page<UserOutput>>;

  update(
    id: number,
    data: UserUpdateInput,
    currentUser: { id: number; role: string },
  ): Promise<UserOutput>;

  delete(id: number, currentUser: { role: string }): Promise<void>;
}

export type { IUserService };
