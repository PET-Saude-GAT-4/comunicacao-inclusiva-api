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

  async create(request: any, response: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default RoleController;
