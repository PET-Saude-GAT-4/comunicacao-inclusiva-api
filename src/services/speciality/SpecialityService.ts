import { BadRequestError } from "@/errors/BadRequestError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import type {
  SpecialityInput,
  SpecialityOutput,
  SpecialityUpdate,
} from "@/models/types/Speciality.type.js";
import type { IProfessionRepository } from "@/repositories/profession/IProfessionRepository.js";
import ProfessionRepository from "@/repositories/profession/ProfessionRepository.js";
import type { ISpecialityRepository } from "@/repositories/speciality/ISpecialityRepository.js";
import SpecialityRepository from "@/repositories/speciality/SpecialityRepository.js";
import { normalize } from "@/utils/normalize.js";

import type { ISpecialityService } from "./ISpecialityService.js";

type Props = {
  specialityRepository?: ISpecialityRepository;
  professionRepository?: IProfessionRepository;
};

class SpecialityService implements ISpecialityService {
  private _specialityRepository: ISpecialityRepository;
  private _professionRepository: IProfessionRepository;

  constructor(props?: Props) {
    this._specialityRepository =
      props?.specialityRepository ?? new SpecialityRepository();
    this._professionRepository =
      props?.professionRepository ?? new ProfessionRepository();
  }

  async create(speciality: SpecialityInput): Promise<SpecialityOutput> {
    if (
      !speciality.name ||
      !speciality.code ||
      speciality.professionId === undefined
    ) {
      throw new BadRequestError("Name, code, and profession are required!");
    }

    if (
      !(await this._professionRepository.existsById!(speciality.professionId))
    ) {
      throw new NotFoundError("This profession does not exist!");
    }

    const name: string = normalize(speciality.name);
    speciality.name = name;

    if (
      await this._specialityRepository.findByNameAndProfessionId(
        speciality.name,
        speciality.professionId,
      )
    ) {
      throw new ConflictError("This name already exists for this profession");
    }

    if (await this._specialityRepository.findByCode(speciality.code)) {
      throw new ConflictError("This code already exists");
    }

    return await this._specialityRepository.create(speciality);
  }

  async update(
    id: number,
    speciality: SpecialityUpdate,
  ): Promise<SpecialityOutput> {
    const existing = await this._specialityRepository.findById!(id);

    if (!existing) {
      throw new NotFoundError("Speciality not found");
    }

    const { name, code } = speciality;

    const updateData: Partial<SpecialityUpdate> = {};

    if (name) {
      const newName = normalize(name);
      const nameExists =
        await this._specialityRepository.findByNameAndProfessionId(
          newName,
          existing.professionId,
        );

      if (nameExists && nameExists.id !== id) {
        throw new ConflictError(
          `This name already exists for the profession ${nameExists.professionId}`,
        );
      }

      updateData.name = newName;
    }

    if (code) {
      const codeExists = await this._specialityRepository.findByCode(code);

      if (codeExists && codeExists.id !== id) {
        throw new ConflictError("This code already exists!");
      }

      updateData.code = code;
    }

    if (Object.keys(updateData).length === 1) {
      throw new BadRequestError("Name or code not provided!");
    }

    return await this._specialityRepository.update(id, updateData);
  }

  async findAll(): Promise<SpecialityOutput[]> {
    return this._specialityRepository.findAll();
  }

  async delete(id: number): Promise<void> {
    if (!(await this._specialityRepository.findById(id))) {
      throw new NotFoundError("No speciality found!");
    }
    await this._specialityRepository.delete(id);
  }

  async findById(id: number): Promise<SpecialityOutput | null> {
    return this._specialityRepository.findById!(id);
  }
}

export default SpecialityService;
