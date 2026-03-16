import type { NextFunction, Request, Response } from "express";

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

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, roleId } = req.body;

      if (!email || !password  || !roleId) {
        res.status(400).json({ error: "Email, password, and role ID are required" });
        return;
      }

      await this._userService.create(email, password, roleId);
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }

  async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await this._userService.findById(id);
      res.status(200).send({ user: user });
    } catch (error) {
      next(error);
    }
  }

  async findAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await this._userService.findAll();
      res.status(200).send({ users: users });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { email, password, roleId } = req.body;

      await this._userService.update(id, { email, password, roleId });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this._userService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
