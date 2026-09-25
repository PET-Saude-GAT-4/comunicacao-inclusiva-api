import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import type { IInvitationService } from "@/services/invitation/IInvitationService.js";
import InvitationService from "@/services/invitation/InvitationService.js";

import type { IInvitationController } from "./IInvitationController.js";

type Props = {
  invitationService?: IInvitationService;
};

class InvitationController implements IInvitationController {
  private _invitationService: IInvitationService;

  constructor(props?: Props) {
    this._invitationService =
      props?.invitationService ?? new InvitationService();
  }

  async accept(req: Request, res: Response): Promise<void> {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new BadRequestError("Token and password are required.");
    }

    await this._invitationService.acceptInvitation(token, password);

    res.status(200).json({ message: "Account confirmed successfully." });
  }

  async resend(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("Email is required.");
    }

    await this._invitationService.resendInvitation(email);

    res.status(200).json({
      message:
        "If the address is associated with a pending account, a new invitation has been sent.",
    });
  }
}

export default InvitationController;
