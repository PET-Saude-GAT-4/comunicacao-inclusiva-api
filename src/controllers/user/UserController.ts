import type { Request, Response } from "express";

import type { IUserService } from "@/services/user/IUserService.js";
import UserService from "@/services/user/UserService.js";

import type { IUserController } from "./IUserController.js";

type Props = {
  userService?: IUserService;
};

class UserController implements IUserController {
  private _userService: IUserService;

  constructor(props?: Props) {
    this._userService = props?.userService ?? new UserService();
  }

  async create(request: Request, response: Response): Promise<Response | void> {
    throw new Error("Method not implemented.");
  }

  async findAll(
    request: Request,
    response: Response,
  ): Promise<Response | void> {
    throw new Error("Method not implemented.");
  }

  async delete(request: Request, response: Response): Promise<Response | void> {
    throw new Error("Method not implemented.");
  }
}

export default UserController;
