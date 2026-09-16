import bcrypt from "bcryptjs";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { UserOutput, UserUpdateInput } from "@/models/types/User.type.js";
import type { IRoleRepository } from "@/repositories/role/IRoleRepository.js";
import RoleRepository from "@/repositories/role/RoleRepository.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";
import { canManageRole } from "@/utils/permissions.js";

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
    currentUser?: { role: string },
  ): Promise<UserOutput> {
    const existsByUserEmail = await this._userRepository.existsByEmail(email);

    const targetRole = await this._roleRepository.findById(roleId);

    if (!targetRole) {
      throw new NotFoundError("Role not found");
    }

    if (currentUser && !canManageRole(currentUser.role, targetRole.name)) {
      throw new ForbiddenError(
        "You do not have permission to assign this role.",
      );
    }

    if (existsByUserEmail) {
      throw new ConflictError("Email already in use");
    }

    const passwordHash = await this.hashPassword(password);
    return this._userRepository.create({ email, passwordHash, roleId });
  }

  async findById(id: number): Promise<UserOutput | null> {
    return this._userRepository.findById(id);
  }

  async findAll(): Promise<UserOutput[]> {
    return this._userRepository.findAll();
  }

  async update(
    id: number,
    data: UserUpdateInput,
    currentUser: { id: number; role: string },
  ): Promise<UserOutput> {
    const query: Partial<UserUpdateInput> = {};

    const userUpdate = data;

    const targetUser = await this._userRepository.findById(id);

    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    if (!canManageRole(currentUser.role, targetUser.role.name)) {
      throw new ForbiddenError(
        "You do not have permission to modify a user with higher or equal privileges.",
      );
    }

    if (data.roleId !== undefined && currentUser.id === id) {
      throw new ForbiddenError("Users cannot change their own role.");
    }

    if (data.roleId !== undefined) {
      const targetRole = await this._roleRepository.findById(data.roleId);

      if (!targetRole) {
        throw new NotFoundError("Role not found");
      }

      if (!canManageRole(currentUser.role, targetRole.name)) {
        throw new ForbiddenError(
          "You do not have permission to assign this role.",
        );
      }
    }

    if (userUpdate.password != undefined) {
      userUpdate.password = await this.hashPassword(userUpdate.password);
    }

    if (
      userUpdate.email == undefined &&
      userUpdate.password == undefined &&
      userUpdate.roleId == undefined
    ) {
      throw new BadRequestError("No valid fields to update");
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

  async delete(id: number, currentUser: { role: string }): Promise<void> {
    const targetUser = await this._userRepository.findById(id);

    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    if (!canManageRole(currentUser.role, targetUser.role.name)) {
      throw new ForbiddenError(
        "You do not have permission to delete a user with higher or equal privileges.",
      );
    }

    await this._userRepository.delete(id);
  }
}

export default UserService;
