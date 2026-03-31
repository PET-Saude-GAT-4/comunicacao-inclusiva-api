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

  async create(req: Request, res: Response): Promise<void> {
    const { email, password, roleId } = req.body;

    if (!email || !password || !roleId) {
      res
        .status(400)
        .json({ error: "Email, password, and role ID are required" });
      return;
    }

    await this._userService.create(email, password, roleId);
    res.status(201).send();
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const user = await this._userService.findById(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: user });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const users = await this._userService.findAll();
    res.status(200).json({ users: users });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const { email, password, roleId } = req.body;

    await this._userService.update(id, { email, password, roleId });
    res.status(204).send();
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await this._userService.delete(id);
    res.status(204).send();
  }
}

export default UserController;
