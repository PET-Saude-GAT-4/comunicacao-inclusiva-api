import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { InteractionChainOutput } from "@/models/types/InteractionChain.type.js";
import type { IInteractionChainService } from "@/services/interaction-chain/IInteractionChainService.js";
import InteractionChainService from "@/services/interaction-chain/InteractionChainService.js";

import type { IInteractionChainController } from "./IInteractionChainController.js";

type Props = {
  interactionChainService?: IInteractionChainService;
};

class InteractionChainController implements IInteractionChainController {
  private _interactionChainService: IInteractionChainService;

  constructor(props?: Props) {
    this._interactionChainService =
      props?.interactionChainService ?? new InteractionChainService();
  }

  private _toResponse(interactionChain: InteractionChainOutput) {
    return {
      uuid: interactionChain.uuid,
      triggerBoardUuid: interactionChain.triggerBoardUuid,
      responseBoardUuid: interactionChain.responseBoardUuid,
      rank: interactionChain.rank,
      label: interactionChain.label,
      createdAt: interactionChain.createdAt,
      updatedAt: interactionChain.updatedAt,
    };
  }

  private _assertOptionalLabel(label: unknown): void {
    if (label !== undefined && label !== null && typeof label !== "string") {
      throw new BadRequestError("Label must be a string");
    }
  }

  private _assertOptionalRank(rank: unknown): void {
    if (rank === undefined) return;

    if (typeof rank !== "number" || !Number.isInteger(rank)) {
      throw new BadRequestError("Rank must be an integer");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const { triggerBoardUuid, responseBoardUuid, rank, label } = req.body;

    if (!triggerBoardUuid || typeof triggerBoardUuid !== "string") {
      throw new BadRequestError("Trigger board uuid is required");
    }

    if (!responseBoardUuid || typeof responseBoardUuid !== "string") {
      throw new BadRequestError("Response board uuid is required");
    }

    this._assertOptionalRank(rank);
    this._assertOptionalLabel(label);

    const interactionChain = await this._interactionChainService.create(
      {
        triggerBoardUuid,
        responseBoardUuid,
        rank,
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

    const { triggerBoardUuid, responseBoardUuid, rank, label } = req.body;

    if (
      triggerBoardUuid === undefined &&
      responseBoardUuid === undefined &&
      rank === undefined &&
      label === undefined
    ) {
      throw new BadRequestError("No fields to update");
    }

    if (
      triggerBoardUuid !== undefined &&
      typeof triggerBoardUuid !== "string"
    ) {
      throw new BadRequestError("Trigger board uuid must be a string");
    }

    if (
      responseBoardUuid !== undefined &&
      typeof responseBoardUuid !== "string"
    ) {
      throw new BadRequestError("Response board uuid must be a string");
    }

    this._assertOptionalRank(rank);
    this._assertOptionalLabel(label);

    const interactionChain = await this._interactionChainService.update(
      uuid,
      {
        triggerBoardUuid,
        responseBoardUuid,
        rank,
        label,
      },
      req.user!,
    );

    res
      .status(200)
      .json({ interactionChain: this._toResponse(interactionChain) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const interactionChains = await this._interactionChainService.findAll(
      req.user!,
    );

    res.status(200).json({
      interactionChains: interactionChains.map((ic) => this._toResponse(ic)),
    });
  }

  async findByUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const interactionChain = await this._interactionChainService.findByUuid(
      uuid,
      req.user!,
    );

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
      await this._interactionChainService.findByTriggerBoardUuid(
        uuid,
        req.user!,
      );

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
