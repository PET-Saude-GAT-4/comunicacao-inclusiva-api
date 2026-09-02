import { BadRequestError } from "@/errors/BadRequestError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { TermInput, TermOutput } from "@/models/types/Term.type.js";
import type { IPictogramRepository } from "@/repositories/pictogram/IPictogramRepository.js";
import PictogramRepository from "@/repositories/pictogram/PictogramRepository.js";
import type { ISignWritingRepository } from "@/repositories/sign-writing/ISignWritingRepository.js";
import SignWritingRepository from "@/repositories/sign-writing/SignWritingRepository.js";
import type { ITermRepository } from "@/repositories/term/ITermRepository.js";
import TermRepository from "@/repositories/term/TermRepository.js";

import type { ITermService } from "./ITermService.js";

type Props = {
  termRepository?: ITermRepository;
  pictogramRepository?: IPictogramRepository;
  signWritingRepository?: ISignWritingRepository;
};

class TermService implements ITermService {
  private _termRepository: ITermRepository;
  private _pictogramRepository: IPictogramRepository;
  private _signWritingRepository: ISignWritingRepository;

  constructor(props?: Props) {
    this._termRepository = props?.termRepository ?? new TermRepository();
    this._pictogramRepository =
      props?.pictogramRepository ?? new PictogramRepository();
    this._signWritingRepository =
      props?.signWritingRepository ?? new SignWritingRepository();
  }

  async create(data: TermInput): Promise<TermOutput> {
    const pictogram = await this._pictogramRepository.findByUuid(
      data.pictogramUuid,
    );

    if (!pictogram) {
      throw new NotFoundError("Pictogram not found");
    }

    const signWriting = await this._signWritingRepository.findByUuid(
      data.signWritingUuid,
    );

    if (!signWriting) {
      throw new NotFoundError("SignWriting not found");
    }

    const alreadyPaired = await this._termRepository.existsPair(
      pictogram.id,
      signWriting.id,
    );

    if (alreadyPaired) {
      throw new ConflictError(
        "This pictogram and signwriting are already paired",
      );
    }

    return await this._termRepository.create({
      pictogramId: pictogram.id,
      signWritingId: signWriting.id,
      description: data.description,
    });
  }

  async findAll(): Promise<TermOutput[]> {
    return this._termRepository.findAll();
  }

  async findById(id: number): Promise<TermOutput | null> {
    return this._termRepository.findById(id);
  }

  async findByUuid(uuid: string): Promise<TermOutput | null> {
    return this._termRepository.findByUuid(uuid);
  }

  private async _assertNotInUse(termId: number): Promise<void> {
    if (await this._termRepository.isInUse(termId)) {
      throw new BadRequestError("You cannot delete a term which is in use");
    }
  }

  async delete(id: number): Promise<void> {
    const term = await this._termRepository.findById(id);

    if (!term) {
      throw new NotFoundError("Term not found");
    }

    await this._assertNotInUse(term.id);

    await this._termRepository.delete(term.id);
  }

  async deleteByUuid(uuid: string): Promise<void> {
    const term = await this._termRepository.findByUuid(uuid);

    if (!term) {
      throw new NotFoundError("Term not found");
    }

    await this._assertNotInUse(term.id);

    await this._termRepository.delete(term.id);
  }
}

export default TermService;
