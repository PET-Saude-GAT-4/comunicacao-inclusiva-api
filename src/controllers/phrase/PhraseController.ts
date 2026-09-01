import type { Request, Response } from "express";

import { toItemResponse } from "@/controllers/term/TermResponse.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { PhraseOutput } from "@/models/types/Phrase.type.js";
import type { IPhraseService } from "@/services/phrase/IPhraseService.js";
import PhraseService from "@/services/phrase/PhraseService.js";

import type { IPhraseController } from "./IPhraseController.js";

type Props = {
  phraseService?: IPhraseService;
};

class PhraseController implements IPhraseController {
  private _phraseService: IPhraseService;

  constructor(props?: Props) {
    this._phraseService = props?.phraseService ?? new PhraseService();
  }

  private _toResponse(phrase: PhraseOutput) {
    return {
      uuid: phrase.uuid,
      description: phrase.description,
      authorUuid: phrase.authorUuid,
      terms: phrase.terms.map((item, index) => ({
        order: index + 1,
        ...toItemResponse(item.uuid, item.term),
      })),
      publishedAt: phrase.publishedAt,
      createdAt: phrase.createdAt,
      updatedAt: phrase.updatedAt,
    };
  }

  private _parseTermUuids(value: unknown): string[] {
    if (!Array.isArray(value) || value.length === 0) {
      throw new BadRequestError("At least one term is required");
    }

    if (value.some((uuid) => !uuid || typeof uuid !== "string")) {
      throw new BadRequestError("Term uuids must be strings");
    }

    return value as string[];
  }

  async create(req: Request, res: Response): Promise<void> {
    const { description, termUuids } = req.body;

    if (!description || typeof description !== "string") {
      throw new BadRequestError("Description is required");
    }

    const phrase = await this._phraseService.create(
      {
        description,
        termUuids: this._parseTermUuids(termUuids),
      },
      req.user!,
    );

    res.status(201).json({ phrase: this._toResponse(phrase) });
  }

  async update(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const { description, termUuids } = req.body;

    if (description === undefined && termUuids === undefined) {
      throw new BadRequestError("No fields to update");
    }

    if (
      description !== undefined &&
      (!description || typeof description !== "string")
    ) {
      throw new BadRequestError("Description must be a non-empty string");
    }

    const phrase = await this._phraseService.update(
      uuid,
      {
        description,
        termUuids:
          termUuids === undefined ? undefined : this._parseTermUuids(termUuids),
      },
      req.user!,
    );

    res.status(200).json({ phrase: this._toResponse(phrase) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const phrases = await this._phraseService.findAll(req.user!);

    res
      .status(200)
      .json({ phrases: phrases.map((phrase) => this._toResponse(phrase)) });
  }

  async findByUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const phrase = await this._phraseService.findByUuid(uuid, req.user!);

    if (!phrase) {
      throw new NotFoundError("Phrase not found");
    }

    res.status(200).json({ phrase: this._toResponse(phrase) });
  }

  async findAllPublished(req: Request, res: Response): Promise<void> {
    const phrases = await this._phraseService.findAllPublished();

    res
      .status(200)
      .json({ phrases: phrases.map((phrase) => this._toResponse(phrase)) });
  }

  async findPublishedByUuid(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const phrase = await this._phraseService.findPublishedByUuid(uuid);

    if (!phrase) {
      throw new NotFoundError("Phrase not found");
    }

    res.status(200).json({ phrase: this._toResponse(phrase) });
  }

  async publish(req: Request, res: Response): Promise<void> {
    await this._phraseService.publish(req.params.uuid as string, req.user!);
    res.status(204).send();
  }

  async unpublish(req: Request, res: Response): Promise<void> {
    await this._phraseService.unpublish(req.params.uuid as string, req.user!);
    res.status(204).send();
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this._phraseService.delete(req.params.uuid as string, req.user!);
    res.status(204).send();
  }
}

export default PhraseController;
