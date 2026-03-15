import type { User } from "@/models/User.js";
import type { IService } from "../Iservice.js";

interface IUserService extends IService<User> {}

export type { IUserService };
