import type { UserOutput } from "@/models/types/User.type.js";

interface IAuthService {
  login(email: string, password: string): Promise<[string, UserOutput]>;
  requestPasswordReset(email: string): Promise<void>;
  confirmPasswordReset(token: string, password: string): Promise<void>;
}

export type { IAuthService };
