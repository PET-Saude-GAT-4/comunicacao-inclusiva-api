import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { SignWritingOutput } from "@/models/types/SignWriting.type.js";
import type { ISignWritingService } from "@/services/sign-writing/ISignWritingService.js";
import SignWritingService from "@/services/sign-writing/SignWritingService.js";
import { buildFileUrl } from "@/utils/file.js";

import type { ISignWritingController } from "./ISignWritingController.js";

type Props = {
  signWritingService?: ISignWritingService;
};

class SignWritingController implements ISignWritingController {
  private _signWritingService: ISignWritingService;

  constructor(props?: Props) {
    this._signWritingService =
      props?.signWritingService ?? new SignWritingService();
  }

  private _toResponse(signWriting: SignWritingOutput): Record<string, unknown> {
    return {
      uuid: signWriting.uuid,
      description: signWriting.description,
      fileUrl: buildFileUrl(signWriting.fileUuid),
      createdAt: signWriting.createdAt,
      updatedAt: signWriting.updatedAt,
    };
  }

  async create(req: Request, res: Response): Promise<void> {
    const { description } = req.body;
    const file = req.file!;

    if (!description) {
      throw new BadRequestError("Description is required");
    }

    const signWriting = await this._signWritingService.create({
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

    res.status(201).json({ signWriting: this._toResponse(signWriting) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const signWritings = await this._signWritingService.findAll();

    res.status(200).json({
      signWritings: signWritings.map((s) => this._toResponse(s)),
    });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const signWriting = await this._signWritingService.findByUuid(uuid);

    if (!signWriting) {
      throw new NotFoundError("SignWriting not found");
    }

    res.status(200).json({ signWriting: this._toResponse(signWriting) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;
    await this._signWritingService.deleteByUuid(uuid);

    res.status(204).send();
  }
}

export default SignWritingController;
