import type { User } from "@/models/User.js";

interface IAuthService {
  login(email: string, password: string): Promise<[string, User]>;

  register(email: string, password: string): Promise<User>;
}

export type { IAuthService };
