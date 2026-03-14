import type { Role } from "@/models/Role.js";

import type { IRepository } from "../IRepository.js";

interface IRoleRepository extends IRepository<Role> {}

export type { IRoleRepository };
