import type { User } from "@/models/User.js";

import type { IRepository } from "../IRepository.js";

interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User>;
    findByUuid(uuid: string): Promise<User>;
    existsByEmail(email: string): Promise<boolean>;
    existsByUuid(uuid: string): Promise<boolean>;
}

export type { IUserRepository };
