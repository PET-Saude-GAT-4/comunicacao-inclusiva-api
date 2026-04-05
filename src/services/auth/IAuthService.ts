import type { UserOutput } from "@/models/types/User.type.js";

interface IAuthService {
  login(email: string, password: string): Promise<[string, UserOutput]>;

  register(email: string, password: string, role: string): Promise<UserOutput>;
}

export type { IAuthService };
