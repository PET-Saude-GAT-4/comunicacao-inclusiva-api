import type { IUserRepository } from "./IUserRepository.js";

class UserRepository implements IUserRepository {
  async create(value: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default UserRepository;
