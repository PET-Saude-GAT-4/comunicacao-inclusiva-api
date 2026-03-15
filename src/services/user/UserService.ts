import type { IUserRepository } from "@/repositories/user/IUserRepository.js";
import UserRepository from "@/repositories/user/UserRepository.js";

import type { IUserService } from "./IUserService.js";

import type { User } from "@/models/User.js";

type Props = {
  userRepository?: IUserRepository;
};

class UserService implements IUserService {
  private _userRepository: IUserRepository;

  constructor(props?: Props) {
    this._userRepository = props?.userRepository ?? new UserRepository();
  }

  async create(value: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
}

export default UserService;
