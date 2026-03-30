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
      throw new Error("Nome, código e profissão são obrigatórios!");
    }

    if (
      !(await this._professionRepository.existsById!(speciality.professionId))
    ) {
      throw new Error("Essa profissão não existe!");
    }

    const name: string = normalize(speciality.name);
    speciality.name = name;

    if (
      await this._specialityRepository.findByNameAndProfessionId(
        speciality.name,
        speciality.professionId,
      )
    ) {
      throw new Error("Esse nome já existe para esta profissão");
    }

    if (await this._specialityRepository.findByCode(speciality.code)) {
      throw new Error("Esse código já existe");
    }

    return await this._specialityRepository.create(speciality);
  }

  async update(
    id: number,
    speciality: SpecialityUpdate,
  ): Promise<SpecialityOutput> {
    const existing = await this._specialityRepository.findById!(id);

    if (!existing) {
      throw new Error("Especialidade não encontrada");
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
        throw new Error(
          `Esse nome já existe para a profissão ${nameExists.professionId}`,
        );
      }

      updateData.name = newName;
    }

    if (code) {
      const codeExists = await this._specialityRepository.findByCode(code);

      if (codeExists && codeExists.id !== id) {
        throw new Error("Esse código já existe!");
      }

      updateData.code = code;
    }

    if (Object.keys(updateData).length === 1) {
      throw new Error("Nome ou código não fornecido!");
    }

    return await this._specialityRepository.update(id, updateData);
  }

  async findAll(): Promise<SpecialityOutput[]> {
    const specialities: SpecialityOutput[] =
      await this._specialityRepository.findAll();
    if (!specialities) {
      throw new Error("Nenhuma especialidade encontrada!");
    }
    return specialities;
  }

  async delete(id: number): Promise<void> {
    if (!(await this._specialityRepository.findById(id))) {
      throw new Error("Nenhuma Especialidade encontrada!");
    }
    await this._specialityRepository.delete(id);
  }

  async findById(id: number): Promise<SpecialityOutput> {
    const speciality = await this._specialityRepository.findById!(id);

    if (!speciality) {
      throw new Error("Especialidade não encontrada");
    }

    return speciality;
  }
}

export default SpecialityService;
