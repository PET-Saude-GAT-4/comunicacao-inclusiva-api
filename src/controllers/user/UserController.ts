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

  async create(request: any, response: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default UserController;
