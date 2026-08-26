import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { IPictogramService } from "@/services/pictogram/IPictogramService.js";
import PictogramService from "@/services/pictogram/PictogramService.js";

import type { IPictogramController } from "./IPictogramController.js";
import { toPictogramResponse } from "./PictogramResponse.js";

type Props = {
  pictogramService?: IPictogramService;
};

class PictogramController implements IPictogramController {
  private _pictogramService: IPictogramService;

  constructor(props?: Props) {
    this._pictogramService = props?.pictogramService ?? new PictogramService();
  }

  async create(req: Request, res: Response): Promise<void> {
    const { description } = req.body;
    const file = req.file!;

    if (!description) {
      throw new BadRequestError("Description is required");
    }

    const pictogram = await this._pictogramService.create({
      description,
      file: {
        buffer: file.buffer,
        filename: file.originalname,
        mimeType: file.mimetype,
        originalName: file.originalname,
        fileSize: file.size,
      },
      userId: req.user?.id ?? null,
    });

    res.status(201).json({ pictogram: toPictogramResponse(pictogram) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const pictograms = await this._pictogramService.findAll();

    res.status(200).json({
      pictograms: pictograms.map((p) => toPictogramResponse(p)),
    });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const pictogram = await this._pictogramService.findByUuid(uuid);

    if (!pictogram) {
      throw new NotFoundError("Pictogram not found");
    }

    res.status(200).json({ pictogram: toPictogramResponse(pictogram) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;
    await this._pictogramService.deleteByUuid(uuid);

    res.status(204).send();
  }
}

export default PictogramController;
