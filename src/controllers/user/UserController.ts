import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
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
    const { email, roleId } = req.body;

    if (!email || !roleId) {
      throw new BadRequestError("Email and role ID are required");
    }

    const user = await this._userService.create(
      email,
      roleId,
      req.user ? { role: req.user.role } : undefined,
    );
    res.status(201).json({ user });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const user = await this._userService.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({ user: user });
  }

  async findByUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;
    const user = await this._userService.findByUuid(uuid);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({ user });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const users = await this._userService.findAll();
    res.status(200).json({ users: users });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const { email, password, roleId } = req.body;
    const user = await this._userService.update(
      id,
      {
        email,
        password,
        roleId,
      },
      { id: req.user!.id, role: req.user!.role },
    );
    res.status(200).json({ user });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await this._userService.delete(id, { role: req.user!.role });
    res.status(204).send();
  }
}

export default UserController;
