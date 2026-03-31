import type {
  UserInput,
  UserOutput,
  UserUpdateInput,
} from "@/models/types/User.type.js";

import type { IRepository } from "../IRepository.js";

interface IUserRepository extends IRepository<UserOutput> {
  findByEmail(email: string): Promise<UserOutput | null>;
  findByUuid(uuid: string): Promise<UserOutput | null>;
  findPasswordHashByEmail(email: string): Promise<string | null>;

  existsByEmail(email: string): Promise<boolean>;
  existsByUuid(uuid: string): Promise<boolean>;

  create(data: UserInput): Promise<UserOutput>;
  update(id: number, data: UserUpdateInput): Promise<UserOutput>;
}

export type { IUserRepository };
