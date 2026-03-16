import { User } from "@/models/User.js";
import type { IUserRepository } from "./IUserRepository.js";

class UserRepository implements IUserRepository {
  async create(value: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async findById(id: number): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  async update(id: number, value: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default UserRepository;
