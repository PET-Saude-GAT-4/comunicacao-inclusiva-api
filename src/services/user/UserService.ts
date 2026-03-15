import bcrypt from "bcryptjs";

import type { User } from "@/models/User.js";
import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";

import type { IUserService } from "./IUserService.js";

type Props = {
  userRepository?: IUserRepository;
};

class UserService implements IUserService {
  private _userRepository: IUserRepository;

  constructor(props?: Props) {
    this._userRepository = props?.userRepository ?? new UserRepository();
  }

  async create(email: string, password: string): Promise<User> {
    const exists = await this._userRepository.existsByEmail(email);

    if (exists) {
      throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    return this._userRepository.create(email, passwordHash);
  }

  async findById(id: number): Promise<User> {
    return this._userRepository.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this._userRepository.findAll();
  }

  async update(
    id: number,
    data: Partial<{ email: string; password: string }>,
  ): Promise<User> {
    return this._userRepository.update(id, data);
  }

  async delete(id: number): Promise<User> {
    return this._userRepository.delete(id);
  }
}

export default UserService;
