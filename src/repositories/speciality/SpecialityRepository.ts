import type { Prisma } from "@/generated/prisma/client.js";
import type {
  SpecialtyInput,
  SpecialtyOutput,
  SpecialtyUpdate,
} from "@/models/types/Specialty.type.js";
import { prisma } from "@/prisma.js";

import type { ISpecialityRepository } from "./ISpecialityRepository.js";

class SpecialityRepository implements ISpecialityRepository {
  async create(speciality: SpecialtyInput): Promise<SpecialtyOutput> {
    const data = await prisma.specialty.create({
      data: {
        code: speciality.code,
        name: speciality.name,
        professionId: speciality.professionId,
      },
    });

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      professionId: data.professionId,
    };
  }

  async findAll(): Promise<SpecialtyOutput[]> {
    const data = await prisma.specialty.findMany();

    return data.map((specialty) => {
      return {
        id: specialty.id,
        code: specialty.code,
        name: specialty.name,
        professionId: specialty.professionId,
      };
    });
  }

  async findById(id: number): Promise<SpecialtyOutput | null> {
    const data = await prisma.specialty.findUnique({ where: { id } });

    return data
      ? {
          id: data.id,
          code: data.code,
          name: data.name,
          professionId: data.professionId,
        }
      : null;
  }

  async update(
    id: number,
    speciality: SpecialtyUpdate,
  ): Promise<SpecialtyOutput> {
    const data: Prisma.SpecialtyUpdateInput = {};

    if (speciality.name !== undefined) {
      data.name = speciality.name;
    }

    if (speciality.code !== undefined) {
      data.code = speciality.code;
    }

    const result = await prisma.specialty.update({
      where: { id },
      data,
    });

    return {
      id: result.id,
      code: result.code,
      name: result.name,
      professionId: result.professionId,
    };
  }

  async delete(id: number): Promise<void> {
    await prisma.specialty.delete({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<SpecialtyOutput | null> {
    const data = await prisma.specialty.findUnique({ where: { code } });

    return data
      ? {
          id: data.id,
          code: data.code,
          name: data.name,
          professionId: data.professionId,
        }
      : null;
  }

  async findByNameAndProfessionId(
    name: string,
    professionId: number,
  ): Promise<SpecialtyOutput | null> {
    const data = await prisma.specialty.findUnique({
      where: {
        name_professionId: {
          name,
          professionId,
        },
      },
    });

    return data
      ? {
          id: data.id,
          code: data.code,
          name: data.name,
          professionId: data.professionId,
        }
      : null;
  }

  async existsById(id: number): Promise<boolean> {
    const count = await prisma.specialty.count({ where: { id } });
    return count > 0;
  }
}

export default SpecialityRepository;
