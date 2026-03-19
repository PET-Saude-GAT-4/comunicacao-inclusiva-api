import type { ISpecialityRepository } from "@/repositories/speciality/ISpecialityRepository.js";
import SpecialityRepository from "@/repositories/speciality/SpecialityRepository.js";
import { normalize } from "@/utils/normalize.js";

import type { ISpecialityService } from "./ISpecialityService.js";

import type { Specialty } from "@/models/Specialty.js";

type Props = {
  specialityRepository?: ISpecialityRepository;
};

class SpecialityService implements ISpecialityService {
  private _specialityRepository: ISpecialityRepository;

  constructor(props?: Props) {
    this._specialityRepository =
      props?.specialityRepository ?? new SpecialityRepository();
  }

  async create(speciality: Partial<Specialty>): Promise<Specialty> {
    if (!speciality.name || !speciality.code || speciality.professionId === undefined) {
      throw new Error("Nome, código e profissão são obrigatórios!");
    }

    const name: string = normalize(speciality.name);
    speciality.name = name;

    if (await this._specialityRepository.findByNameAndProfessionId(speciality.name, speciality.professionId)) {
      throw new Error("Esse nome já existe para esta profissão");
    }

    if (await this._specialityRepository.findByCode(speciality.code)) {
      throw new Error("Esse código já existe");
    }

    return await this._specialityRepository.create(speciality);
  }

  async update(id: number, speciality: Partial<Specialty>): Promise<Specialty> {
    const existing = await this._specialityRepository.findById!(id);

    if (!existing) {
      throw new Error("Especialidade não encontrada");
    }

    if (speciality.name !== undefined || speciality.professionId !== undefined) {
      const newName = speciality.name !== undefined ? normalize(speciality.name) : existing.name;
      const newProfessionId = speciality.professionId !== undefined ? speciality.professionId : existing.professionId;

      if (speciality.name !== undefined) {
        speciality.name = newName;
      }

      const nameExists = await this._specialityRepository.findByNameAndProfessionId(newName, newProfessionId);

      if (nameExists && nameExists.id !== id) {
        throw new Error("Esse nome já existe para esta profissão");
      }
    }

    if (speciality.code !== undefined) {
      const codeExists = await this._specialityRepository.findByCode(speciality.code);

      if (codeExists && codeExists.id !== id) {
        throw new Error("Esse código já existe");
      }
    }

    return await this._specialityRepository.update!(id, speciality);
  }

  async findAll(): Promise<Specialty[]> {
    const specialties: Specialty[] = await this._specialityRepository.findAll();
    if (!specialties) {
      throw new Error("Nenhuma especialidade encontrada!");
    }
    return specialties;
  }

  async delete(id: number): Promise<void> {
    await this._specialityRepository.delete(id);
  }

  async findById(id: number): Promise<Specialty> {
    const specialty = await this._specialityRepository.findById!(id);

    if (!specialty) {
      throw new Error("Especialidade não encontrada");
    }

    return specialty;
  }
}

export default SpecialityService;
