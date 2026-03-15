import type { RoleInput, RoleOutput } from "@/models/types/Role.type.js";
import type { UserOutput } from "@/models/types/User.type.js";

import type { IRepository } from "../IRepository.js";

interface IRoleRepository extends IRepository<RoleOutput> {
  findAttributedUsers(id: number): Promise<UserOutput[]>;
  create(data: RoleInput): Promise<RoleOutput>;
  update(id: number, data: RoleInput): Promise<RoleOutput>;
}

export type { IRoleRepository };
