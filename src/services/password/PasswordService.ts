import bcrypt from "bcryptjs";

import { env } from "@/config/env.js";
import { BadRequestError } from "@/errors/BadRequestError.js";

import type { IPasswordService } from "./IPasswordService.js";

class PasswordService implements IPasswordService {
  isValidLength(password: string): boolean {
    return password.length >= env.minPasswordLength;
  }

  async validateAndHash(password: string): Promise<string> {
    if (!password || !this.isValidLength(password))
      throw new BadRequestError(
        `The password must be ${env.minPasswordLength} long`,
      );

    return bcrypt.hash(password, 12);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export default PasswordService
