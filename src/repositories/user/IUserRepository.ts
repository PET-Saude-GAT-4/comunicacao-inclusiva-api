import type { User } from "@/models/User.js";

import type { IRepository } from "../IRepository.js";

interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User>;
  findByUuid(uuid: string): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUuid(uuid: string): Promise<boolean>;

  create(email: string, passwordHash: string): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;

  roleConnect(id: number, roleId: number): Promise<User>;
  roleDisconnect(id: number, roleId: number): Promise<User>;
}

export type { IUserRepository };
