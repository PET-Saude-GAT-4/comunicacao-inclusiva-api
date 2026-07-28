import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { InteractionChainOutput } from "@/models/types/InteractionChain.type.js";
import InteractionChainService from "@/services/interaction-chain/InteractionChainService.js";

import type { IInteractionChainController } from "./IInteractionChainController.js";

type Props = {
  interactionChainService?: InteractionChainService;
};

export class InteractionChainController implements IInteractionChainController {
  private _interactionChainService: InteractionChainService;

  constructor(props?: Props) {
    this._interactionChainService =
      props?.interactionChainService ?? new InteractionChainService();
  }

  private _toResponse(interactionChain: InteractionChainOutput) {
    return {
      uuid: interactionChain.uuid,
      triggerBoardUuid: interactionChain.triggerBoardUuid,
      responseBoardUuid: interactionChain.responseBoardUuid,
      label: interactionChain.label,
      createdAt: interactionChain.createdAt,
      updatedAt: interactionChain.updatedAt,
    };
  }

  async create(req: Request, res: Response): Promise<void> {
    const { triggerBoardUuid, responseBoardUuid, label } = req.body;

    if (!triggerBoardUuid) {
      throw new BadRequestError("Trigger board is required");
    }

    if (!responseBoardUuid) {
      throw new BadRequestError("Response board is required");
    }

    const interactionChain = await this._interactionChainService.create(
      {
        triggerBoardUuid,
        responseBoardUuid,
        label,
      },
      req.user!,
    );

    res
      .status(201)
      .json({ interactionChain: this._toResponse(interactionChain) });
  }

  async update(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const { triggerBoardUuid, responseBoardUuid, label } = req.body;

    const interactionChain = await this._interactionChainService.update(
      uuid,
      {
        triggerBoardUuid,
        responseBoardUuid,
        label,
      },
      req.user!,
    );

    res
      .status(200)
      .json({ interactionChain: this._toResponse(interactionChain) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const interactionChains = await this._interactionChainService.findAll();

    res.status(200).json({
      interactionChains: interactionChains.map((ic) => this._toResponse(ic)),
    });
  }

  async findByUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const interactionChain =
      await this._interactionChainService.findByUuid(uuid);

    if (!interactionChain) {
      throw new NotFoundError("Interaction chain not found");
    }

    res
      .status(200)
      .json({ interactionChain: this._toResponse(interactionChain) });
  }

  async findByTriggerBoardUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const interactionChains =
      await this._interactionChainService.findByTriggerBoardUuid(uuid);

    res.status(200).json({
      interactionChains: interactionChains.map((ic) => this._toResponse(ic)),
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    await this._interactionChainService.delete(uuid, req.user!);
    res.status(204).send();
  }
}

export default InteractionChainController;
