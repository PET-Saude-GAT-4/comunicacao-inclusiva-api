import type { Request, Response } from "express";

import { BadRequestError } from "@/errors/BadRequestError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { ISignWritingService } from "@/services/sign-writing/ISignWritingService.js";
import SignWritingService from "@/services/sign-writing/SignWritingService.js";

import type { ISignWritingController } from "./ISignWritingController.js";
import { toSignWritingResponse } from "./SignWritingResponse.js";

type Props = {
  signWritingService?: ISignWritingService;
};

class SignWritingController implements ISignWritingController {
  private _signWritingService: ISignWritingService;

  constructor(props?: Props) {
    this._signWritingService =
      props?.signWritingService ?? new SignWritingService();
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

    res.status(201).json({ signWriting: toSignWritingResponse(signWriting) });
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const signWritings = await this._signWritingService.findAll();

    res.status(200).json({
      signWritings: signWritings.map((s) => toSignWritingResponse(s)),
    });
  }

  async findById(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;

    const signWriting = await this._signWritingService.findByUuid(uuid);

    if (!signWriting) {
      throw new NotFoundError("SignWriting not found");
    }

    res.status(200).json({ signWriting: toSignWritingResponse(signWriting) });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const uuid = req.params.uuid as string;
    await this._signWritingService.deleteByUuid(uuid);

    res.status(204).send();
  }
}

export default SignWritingController;
