import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";
import AuthService from "@/services/auth/AuthService.js";
import type { IAuthService } from "@/services/auth/IAuthService.js";
import type { IUserService } from "@/services/user/IUserService.js";
import UserService from "@/services/user/UserService.js";

import type { IAuthController } from "./IAuthController.js";

type Props = {
  authService?: IAuthService;
  userService?: IUserService;
};

class AuthController implements IAuthController {
  private _authService: IAuthService;
  private _userService: IUserService;

  constructor(props?: Props) {
    this._authService = props?.authService ?? new AuthService();
    this._userService = props?.userService ?? new UserService();
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required.");
    }

    const [token, user] = await this._authService.login(email, password);
    res.status(200).json({ token: token, user: user });
  }

  async checkToken(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const user = await this._userService.findById(req.user.id);

    res.status(200).json({ user: user });
  }

  async register(req: Request, res: Response): Promise<void> {
    const { email, password, role } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email, password and role are required");
    }

    const user = await this._authService.register(email, password, role);
    res.status(201).json({ user });
  }
}

export default AuthController;
