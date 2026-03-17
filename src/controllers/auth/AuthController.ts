import type { NextFunction, Request, Response } from "express";

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

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
      }

      const [token, user] = await this._authService.login(email, password);
      res.status(200).send({ token: token, user: user });
    } catch (error) {
      next(error);
    }
  }

  async checkToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const user = await this._userService.findById(req.user.id);

      res.status(200).send({ user: user });
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password, roleId } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ error: "Email, password and roleId are required" });
        return;
      }

      await this._authService.register(email, password, roleId);
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
