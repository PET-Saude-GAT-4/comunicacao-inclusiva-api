import bcrypt from "bcryptjs";

import type { UserOutput, UserUpdateInput } from "@/models/types/User.type.js";
import type { IRoleRepository } from "@/repositories/role/IRoleRepository.js";
import RoleRepository from "@/repositories/role/RoleRepository.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";

import type { IUserService } from "./IUserService.js";

type Props = {
  userRepository?: IUserRepository;
  roleRepository?: IRoleRepository;
};

class UserService implements IUserService {
  private _userRepository: IUserRepository;
  private _roleRepository: IRoleRepository;

  constructor(props?: Props) {
    this._userRepository = props?.userRepository ?? new UserRepository();
    this._roleRepository = props?.roleRepository ?? new RoleRepository();
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async create(
    email: string,
    password: string,
    roleId: number,
  ): Promise<UserOutput> {
    const existsByUserEmail = await this._userRepository.existsByEmail(email);

    const existsByRoleId = await this._roleRepository.existsById(roleId);

    if (!existsByRoleId) {
      throw new Error("Role not found");
    }

    if (existsByUserEmail) {
      throw new Error("Email already in use");
    }

    const passwordHash = await this.hashPassword(password);
    return this._userRepository.create({ email, passwordHash, roleId });
  }

  async findById(id: number): Promise<UserOutput> {
    return this._userRepository.findById(id);
  }

  async findAll(): Promise<UserOutput[]> {
    return this._userRepository.findAll();
  }

  async update(id: number, data: UserUpdateInput): Promise<UserOutput> {
    const query: Partial<UserUpdateInput> = {};

    const userUpdate = data;

    if (userUpdate.password != undefined) {
      userUpdate.password = await this.hashPassword(userUpdate.password);
    }

    if (
      userUpdate.email == undefined &&
      userUpdate.password == undefined &&
      userUpdate.roleId == undefined
    ) {
      throw new Error("No valid fields to update");
    }

    if (userUpdate.email != undefined) {
      query.email = userUpdate.email;
    }

    if (userUpdate.password != undefined) {
      query.password = userUpdate.password;
    }

    if (userUpdate.roleId != undefined) {
      query.roleId = userUpdate.roleId;
    }

    return this._userRepository.update(id, query);
  }

  async delete(id: number): Promise<UserOutput> {
    return this._userRepository.delete(id);
  }
}

export default UserService;
