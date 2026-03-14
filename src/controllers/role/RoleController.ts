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
}

export default RoleController;
