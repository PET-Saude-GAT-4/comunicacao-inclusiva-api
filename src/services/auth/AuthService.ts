import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "@/config/env.js";
import { AccountNotConfirmedError } from "@/errors/AccountNotConfirmedError.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";
import type { UserOutput } from "@/models/types/User.type.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";

import type { IAuthService } from "./IAuthService.js";

type Props = {
  userRepository?: IUserRepository;
};

class AuthService implements IAuthService {
  private _userRepository: IUserRepository;

  constructor(props?: Props) {
    this._userRepository = props?.userRepository ?? new UserRepository();
  }

  async login(email: string, password: string): Promise<[string, UserOutput]> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedError("Invalid credentials");

    if (user.confirmedAt === null) {
      throw new AccountNotConfirmedError();
    }

    const passwordHash =
      await this._userRepository.findPasswordHashByEmail(email);

    if (!passwordHash) throw new UnauthorizedError("Invalid credentials");

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        role: user.role.name,
        confirmed: user.confirmedAt !== null,
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn as NonNullable<
          jwt.SignOptions["expiresIn"]
        >,
      },
    );

    return [token, user];
  }
}

export default AuthService;
