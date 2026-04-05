import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ConflictError } from "@/errors/ConflictError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";
import type { UserOutput } from "@/models/types/User.type.js";
import type { IRoleRepository } from "@/repositories/role/IRoleRepository.js";
import RoleRepository from "@/repositories/role/RoleRepository.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";

import type { IAuthService } from "./IAuthService.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

type Props = {
  userRepository?: IUserRepository;
  roleRepository?: IRoleRepository;
};

class AuthService implements IAuthService {
  private _userRepository: IUserRepository;
  private _roleRepository: IRoleRepository;

  constructor(props?: Props) {
    this._userRepository = props?.userRepository ?? new UserRepository();
    this._roleRepository = props?.roleRepository ?? new RoleRepository();
  }

  async login(email: string, password: string): Promise<[string, UserOutput]> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedError("Invalid credentials");

    const passwordHash =
      await this._userRepository.findPasswordHashByEmail(email);

    if (!passwordHash) throw new UnauthorizedError("Invalid credentials");

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    return [token, user];
  }

  async register(
    email: string,
    password: string,
    role: string,
  ): Promise<UserOutput> {
    const exists = await this._userRepository.existsByEmail(email);

    if (exists) {
      throw new ConflictError("E-mail already in use");
    }

    const roleRecord = await this._roleRepository.findByName(role);

    if (!roleRecord) {
      throw new NotFoundError("Role not found.");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    return this._userRepository.create({
      email: email,
      passwordHash: passwordHash,
      roleId: roleRecord.id,
    });
  }
}

export default AuthService;
