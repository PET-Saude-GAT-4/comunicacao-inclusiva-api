import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { InteractionChainOutput } from "@/models/types/InteractionChain.type.js";
import InteractionChainService from "@/services/interaction-chain/InteractionChainService.js";

import type IInteractionChainController from "./IInteractionChainController.js";

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
      id: interactionChain.id,
      uuid: interactionChain.uuid,
      createdAt: interactionChain.createdAt,
      updatedAt: interactionChain.updatedAt,
      triggerBoardUuid: interactionChain.triggerBoardUuid,
      responseBoardUuid: interactionChain.responseBoardUuid,
      label: interactionChain.label,
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
    const id = parseInt(req.params.id as string);

    const { triggerBoardUuid, responseBoardUuid, label } = req.body;

    const interactionChain = await this._interactionChainService.update(
      id,
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

  async findById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string);

    const interactionChain = await this._interactionChainService.findById(id);

    if (!interactionChain) {
      throw new NotFoundError("Interaction chain not found");
    }

    res
      .status(200)
      .json({ interactionChain: this._toResponse(interactionChain) });
  }

  async findByTriggerBoardUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const interactionChainList =
      await this._interactionChainService.findByTriggerBoardUuid(uuid);

    if (!interactionChainList || interactionChainList.length === 0) {
      res.status(200).json({ interactionChains: [] });
      return;
    }

    res
      .status(200)
      .json({ interactionChains: interactionChainList.map(this._toResponse) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string);

    await this._interactionChainService.delete(id, req.user!);
    res.status(204).send();
  }
}

export default InteractionChainController;
