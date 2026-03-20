import type { User } from "@/models/User.js";

import type { Icontroller } from "../Icontroller.js";

interface IUserController extends Icontroller<User> {}

export type { IUserController };
