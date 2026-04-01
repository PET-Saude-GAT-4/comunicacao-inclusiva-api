import { BadRequestError } from "@/errors/BadRequestError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type { ProfessionUpdateInput } from "@/generated/prisma/models.js";
import type {
  ProfessionInput,
  ProfessionOutput,
  ProfessionUpdate,
} from "@/models/types/Profession.type.js";
import type { IProfessionRepository } from "@/repositories/profession/IProfessionRepository.js";
import ProfessionRepository from "@/repositories/profession/ProfessionRepository.js";
import { normalize } from "@/utils/normalize.js";

import type { IProfessionService } from "./IProfessionService.js";

type Props = {
  professionRepository: IProfessionRepository;
};

class ProfessionService implements IProfessionService {
  private _professionRepository: IProfessionRepository;

  constructor(props?: Props) {
    this._professionRepository =
      props?.professionRepository ?? new ProfessionRepository();
  }

  async create(profession: ProfessionInput): Promise<ProfessionOutput> {
    const { name, code } = profession;

    if (!name || !code) {
      throw new BadRequestError("Name and code are required!");
    }

    const normalizedName = normalize(name);

    if (await this._professionRepository.findByName(normalizedName)) {
      throw new ConflictError("This name already exists");
    }

    if (await this._professionRepository.findByCode(code)) {
      throw new ConflictError("This code already exists");
    }

    return await this._professionRepository.create({
      name: normalizedName,
      code,
    });
  }

  async update(
    id: number,
    profession: ProfessionUpdate,
  ): Promise<ProfessionOutput> {
    const existing = await this._professionRepository.findById!(id);

    if (!existing) {
      throw new NotFoundError("Profession not found");
    }

    const { name, code } = profession;
    const updateData: Partial<ProfessionUpdate> = {};

    if (name) {
      const newName = normalize(name);
      const nameExists = await this._professionRepository.findByName(newName);

      if (nameExists && nameExists.id !== id) {
        throw new ConflictError("This name already exists");
      }

      updateData.name = newName;
    }

    if (code) {
      const codeExists = await this._professionRepository.findByCode(code);

      if (codeExists && codeExists.id !== id) {
        throw new ConflictError("This code already exists");
      }

      updateData.code = code;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No parameters provided!");
    }

    return await this._professionRepository.update(id, updateData);
  }

  async findAll(): Promise<ProfessionOutput[]> {
    return this._professionRepository.findAll();
  }

  async delete(id: number): Promise<void> {
    if (!(await this._professionRepository.findById(id))) {
      throw new NotFoundError("No profession found!");
    }
    await this._professionRepository.delete(id);
  }

  async findById(id: number): Promise<ProfessionOutput | null> {
    return this._professionRepository.findById!(id);
  }
}

export default ProfessionService;
