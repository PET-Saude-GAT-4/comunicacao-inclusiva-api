import type { Request, Response } from "express";

import type { RoleInput } from "@/models/types/Role.type.js";
import type { IRoleService } from "@/services/role/IRoleService.js";
import RoleService from "@/services/role/RoleService.js";

import type { IRoleController } from "./IRoleController.js";

type Props = {
  roleService?: IRoleService;
};

class RoleController implements IRoleController {
  private _roleService: IRoleService;

  constructor(props?: Props) {
    this._roleService = props?.roleService ?? new RoleService();
  }

  async create(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    await this._roleService.create(name);
    res.status(201).send();
  }

  async findById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const role = await this._roleService.findById(id);

    if (!role) {
      res.status(404).json({ error: "Role not found" });
      return;
    }

    res.status(200).json({ role: role });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const roles = await this._roleService.findAll();
    res.status(200).json({ roles: roles });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const { name } = req.body;

    const roleInput: RoleInput = { name };

    if (!roleInput.name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    await this._roleService.update(id, roleInput);
    res.status(204).send();
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await this._roleService.delete(id);
    res.status(204).send();
  }
}

export default RoleController;
