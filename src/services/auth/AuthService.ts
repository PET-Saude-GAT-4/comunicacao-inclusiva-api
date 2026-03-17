import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    if (!user) throw new Error("Invalid credentials");

    const role = await this._roleRepository.findById(user.roleId);

    const passwordHash =
      await this._userRepository.findPasswordHashByEmail(email);

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: role.name },
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
    roleId: number,
  ): Promise<UserOutput> {
    const exists = await this._userRepository.existsByEmail(email);

    if (exists) {
      throw new Error("E-mail already in use");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    return this._userRepository.create({
      email: email,
      passwordHash: passwordHash,
      roleId: roleId,
    });
  }
}

export default AuthService;
