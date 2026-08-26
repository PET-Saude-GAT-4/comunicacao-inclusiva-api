import type { Request, Response } from "express";

import { toPictogramResponse } from "@/controllers/pictogram/PictogramResponse.js";
import { toSignWritingResponse } from "@/controllers/sign-writing/SignWritingResponse.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { TermOutput } from "@/models/types/Term.type.js";
import type { ITermService } from "@/services/term/ITermService.js";
import TermService from "@/services/term/TermService.js";

import type { ITermController } from "./ITermController.js";

type Props = {
  termService?: ITermService;
};

class TermController implements ITermController {
  private _termService: ITermService;

  constructor(props?: Props) {
    this._termService = props?.termService ?? new TermService();
  }

  private _toResponse(term: TermOutput): Record<string, unknown> {
    return {
      uuid: term.uuid,
      description: term.description,
      pictogram: toPictogramResponse(term.pictogram),
      signWriting: toSignWritingResponse(term.signWriting),
      createdAt: term.createdAt,
      updatedAt: term.updatedAt,
    };
  }

  async create(req: Request, res: Response): Promise<void> {
    const { pictogramUuid, signWritingUuid, description } = req.body;

    if (!description || typeof description !== "string") {
      throw new BadRequestError("Description is required");
    }

    if (!pictogramUuid || typeof pictogramUuid !== "string") {
      throw new BadRequestError("Pictogram is required");
    }

    if (!signWritingUuid || typeof signWritingUuid !== "string") {
      throw new BadRequestError("SignWriting is required");
    }

    const term = await this._termService.create({
      pictogramUuid,
      signWritingUuid,
      description,
    });

    res.status(201).json({ term: this._toResponse(term) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const terms = await this._termService.findAll();

    res.status(200).json({
      terms: terms.map((t) => this._toResponse(t)),
    });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const term = await this._termService.findByUuid(uuid);

    if (!term) {
      throw new NotFoundError("Term not found");
    }

    res.status(200).json({ term: this._toResponse(term) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;
    await this._termService.deleteByUuid(uuid);

    res.status(204).send();
  }
}

export default TermController;
