import type { Prisma } from "@/generated/prisma/client.js";
import type {
  SpecialityInput,
  SpecialityOutput,
  SpecialityUpdate,
} from "@/models/types/Speciality.type.js";
import { prisma } from "@/prisma.js";

import type { ISpecialityRepository } from "./ISpecialityRepository.js";

class SpecialityRepository implements ISpecialityRepository {
  async create(speciality: SpecialityInput): Promise<SpecialityOutput> {
    const data = await prisma.speciality.create({
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
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findAll(): Promise<SpecialityOutput[]> {
    const data = await prisma.speciality.findMany();

    return data.map((speciality) => {
      return {
        id: speciality.id,
        code: speciality.code,
        name: speciality.name,
        professionId: speciality.professionId,
        createdAt: speciality.createdAt,
        updatedAt: speciality.updatedAt,
      };
    });
  }

  async findById(id: number): Promise<SpecialityOutput | null> {
    const data = await prisma.speciality.findUnique({ where: { id } });

    return data
      ? {
          id: data.id,
          code: data.code,
          name: data.name,
          professionId: data.professionId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      : null;
  }

  async update(
    id: number,
    speciality: SpecialityUpdate,
  ): Promise<SpecialityOutput> {
    const data: Prisma.SpecialityUpdateInput = {};

    if (speciality.name !== undefined) {
      data.name = speciality.name;
    }

    if (speciality.code !== undefined) {
      data.code = speciality.code;
    }

    const result = await prisma.speciality.update({
      where: { id },
      data,
    });

    return {
      id: result.id,
      code: result.code,
      name: result.name,
      professionId: result.professionId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async delete(id: number): Promise<void> {
    await prisma.speciality.deleteMany({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<SpecialityOutput | null> {
    const data = await prisma.speciality.findUnique({ where: { code } });

    return data
      ? {
          id: data.id,
          code: data.code,
          name: data.name,
          professionId: data.professionId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      : null;
  }

  async findByNameAndProfessionId(
    name: string,
    professionId: number,
  ): Promise<SpecialityOutput | null> {
    const data = await prisma.speciality.findUnique({
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
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      : null;
  }

  async existsById(id: number): Promise<boolean> {
    const count = await prisma.speciality.count({ where: { id } });
    return count > 0;
  }
}

export default SpecialityRepository;
