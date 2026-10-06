import type { Request, Response } from "express";

import { toTriageStepResponse } from "@/controllers/triage-step/TriageStepResponse.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import {
  MAX_TRIAGE_LEVEL,
  MIN_TRIAGE_LEVEL,
} from "@/models/types/TriageStep.type.js";
import type { ITriageStepService } from "@/services/triage-step/ITriageStepService.js";
import TriageStepService from "@/services/triage-step/TriageStepService.js";

import type { ITriageStepController } from "./ITriageStepController.js";

type Props = {
  triageStepService?: ITriageStepService;
};

class TriageStepController implements ITriageStepController {
  private _triageStepService: ITriageStepService;

  constructor(props?: Props) {
    this._triageStepService =
      props?.triageStepService ?? new TriageStepService();
  }

  // The database CHECK rejects anything else too; checking first answers with
  // a 400 that names the range.
  private _assertLevel(level: unknown): asserts level is number {
    if (
      typeof level !== "number" ||
      !Number.isInteger(level) ||
      level < MIN_TRIAGE_LEVEL ||
      level > MAX_TRIAGE_LEVEL
    ) {
      throw new BadRequestError(
        `Level must be an integer from ${MIN_TRIAGE_LEVEL} to ${MAX_TRIAGE_LEVEL}`,
      );
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const { boardUuid, level } = req.body;

    if (!boardUuid || typeof boardUuid !== "string") {
      throw new BadRequestError("Board uuid is required");
    }

    if (level === undefined) {
      throw new BadRequestError("Level is required");
    }

    this._assertLevel(level);

    const triageStep = await this._triageStepService.create(
      { boardUuid, level },
      req.user!,
    );

    res.status(201).json({ triageStep: toTriageStepResponse(triageStep) });
  }

  async update(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;
    const { level } = req.body;

    if (level === undefined) {
      throw new BadRequestError("No fields to update");
    }

    this._assertLevel(level);

    const triageStep = await this._triageStepService.update(
      uuid,
      { level },
      req.user!,
    );

    res.status(200).json({ triageStep: toTriageStepResponse(triageStep) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const triageSteps = await this._triageStepService.findAll();

    res.status(200).json({
      triageSteps: triageSteps.map((ts) => toTriageStepResponse(ts)),
    });
  }

  async findByUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const triageStep = await this._triageStepService.findByUuid(uuid);

    if (!triageStep) {
      throw new NotFoundError("Triage step not found");
    }

    res.status(200).json({ triageStep: toTriageStepResponse(triageStep) });
  }

  async findAllPublished(req: Request, res: Response): Promise<void> {
    const triageSteps = await this._triageStepService.findAllPublished();

    res.status(200).json({
      triageSteps: triageSteps.map((ts) => toTriageStepResponse(ts)),
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    await this._triageStepService.delete(uuid, req.user!);
    res.status(204).send();
  }
}

export default TriageStepController;
