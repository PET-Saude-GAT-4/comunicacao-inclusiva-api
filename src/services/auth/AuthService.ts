import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { User } from "@/models/User.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";

import type { IAuthService } from "./IAuthService.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

type Props = {
  userRepository?: IUserRepository;
};

class AuthService implements IAuthService {
  private _userRepository: IUserRepository;

  constructor(props?: Props) {
    this._userRepository = props?.userRepository ?? new UserRepository();
  }

  async login(email: string, password: string): Promise<[string, User]> {
    const user = await this._userRepository.findByEmail(email);

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return [token, user];
  }

  async register(email: string, password: string): Promise<User> {
    const exists = await this._userRepository.existsByEmail(email);

    if (exists) {
      throw new Error("E-mail already in use");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    return this._userRepository.create(email, passwordHash);
  }
}

export default AuthService;
