import type { Prisma } from "@/generated/prisma/client.js";
import { Specialty } from "@/models/Specialty.js";
import { prisma } from "@/prisma.js";

import type { ISpecialityRepository } from "./ISpecialityRepository.js";

class SpecialityRepository implements ISpecialityRepository {
  async create(speciality: Specialty): Promise<Specialty> {
    const data = await prisma.specialty.create({
      data: {
        code: speciality.code,
        name: speciality.name,
        professionId: speciality.professionId,
      },
    });

    return new Specialty(data.id, data.code, data.name, data.professionId);
  }

  async findAll(): Promise<Specialty[]> {
    const data = await prisma.specialty.findMany();

    return data.map((specialty) => {
      return new Specialty(specialty.id, specialty.code, specialty.name, specialty.professionId);
    });
  }

  async findById(id: number): Promise<Specialty | null> {
    const data = await prisma.specialty.findUnique({ where: { id } });

    return data ? new Specialty(data.id, data.code, data.name, data.professionId) : null;
  }

  async update(id: number, speciality: Partial<Specialty>): Promise<Specialty> {
    const data: Prisma.SpecialtyUpdateInput = {};

    if (speciality.name !== undefined) {
      data.name = speciality.name;
    }

    if (speciality.code !== undefined) {
      data.code = speciality.code;
    }

    if (speciality.professionId !== undefined) {
      data.profession = { connect: { id: speciality.professionId } };
    }

    const result = await prisma.specialty.update({
      where: { id },
      data,
    });

    return new Specialty(result.id, result.code, result.name, result.professionId);
  }

  async delete(id: number): Promise<void> {
    await prisma.specialty.delete({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Specialty | null> {
    const data = await prisma.specialty.findUnique({ where: { code } });

    return data ? new Specialty(data.id, data.code, data.name, data.professionId) : null;
  }

  async findByNameAndProfessionId(name: string, professionId: number): Promise<Specialty | null> {
    const data = await prisma.specialty.findUnique({
      where: {
        name_professionId: {
          name,
          professionId,
        },
      },
    });

    return data ? new Specialty(data.id, data.code, data.name, data.professionId) : null;
  }
}

export default SpecialityRepository;
