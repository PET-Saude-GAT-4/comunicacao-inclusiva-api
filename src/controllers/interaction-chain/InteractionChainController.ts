import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type {
  ChainTrigger,
  InteractionChainOutput,
} from "@/models/types/InteractionChain.type.js";
import type { IInteractionChainService } from "@/services/interaction-chain/IInteractionChainService.js";
import InteractionChainService from "@/services/interaction-chain/InteractionChainService.js";

import type { IInteractionChainController } from "./IInteractionChainController.js";

type Props = {
  interactionChainService?: IInteractionChainService;
};

const TRIGGER_TYPES = ["board", "phrase"] as const;

class InteractionChainController implements IInteractionChainController {
  private _interactionChainService: IInteractionChainService;

  constructor(props?: Props) {
    this._interactionChainService =
      props?.interactionChainService ?? new InteractionChainService();
  }

  private _toResponse(interactionChain: InteractionChainOutput) {
    return {
      uuid: interactionChain.uuid,
      trigger: interactionChain.trigger,
      responseBoardUuid: interactionChain.responseBoardUuid,
      rank: interactionChain.rank,
      label: interactionChain.label,
      createdAt: interactionChain.createdAt,
      updatedAt: interactionChain.updatedAt,
    };
  }

  // The nested trigger makes "both" and "neither" unrepresentable, so what is
  // left to reject is a missing, malformed or unknown one.
  private _parseTrigger(trigger: unknown): ChainTrigger {
    if (typeof trigger !== "object" || trigger === null) {
      throw new BadRequestError("Trigger is required");
    }

    const { type, uuid } = trigger as { type?: unknown; uuid?: unknown };

    if (!TRIGGER_TYPES.includes(type as (typeof TRIGGER_TYPES)[number])) {
      throw new BadRequestError(
        `Trigger type must be one of: ${TRIGGER_TYPES.join(", ")}`,
      );
    }

    if (!uuid || typeof uuid !== "string") {
      throw new BadRequestError("Trigger uuid is required");
    }

    return { type: type as (typeof TRIGGER_TYPES)[number], uuid };
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
    const { trigger, responseBoardUuid, rank, label } = req.body;

    const parsedTrigger = this._parseTrigger(trigger);

    if (!responseBoardUuid || typeof responseBoardUuid !== "string") {
      throw new BadRequestError("Response board uuid is required");
    }

    this._assertOptionalRank(rank);
    this._assertOptionalLabel(label);

    const interactionChain = await this._interactionChainService.create(
      {
        trigger: parsedTrigger,
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

    const { trigger, responseBoardUuid, rank, label } = req.body;

    if (
      trigger === undefined &&
      responseBoardUuid === undefined &&
      rank === undefined &&
      label === undefined
    ) {
      throw new BadRequestError("No fields to update");
    }

    const parsedTrigger =
      trigger !== undefined ? this._parseTrigger(trigger) : undefined;

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
        trigger: parsedTrigger,
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
    await this._respondWithTriggerChains(req, res, "board");
  }

  async findByTriggerPhraseUuid(req: Request, res: Response): Promise<void> {
    await this._respondWithTriggerChains(req, res, "phrase");
  }

  private async _respondWithTriggerChains(
    req: Request,
    res: Response,
    type: ChainTrigger["type"],
  ): Promise<void> {
    const uuid = req.params.uuid as string;

    const interactionChains = await this._interactionChainService.findByTrigger(
      { type, uuid },
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
