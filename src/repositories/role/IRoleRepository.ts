import type { Role } from "@/models/Role.js";
import type { User } from "@/models/User.js";

import type { IRepository } from "../IRepository.js";

interface IRoleRepository extends IRepository<Role> {
  findAttributedUsers(id: number): Promise<User[]>;
  update(id: number, name: string): Promise<Role>;
}

export type { IRoleRepository };
