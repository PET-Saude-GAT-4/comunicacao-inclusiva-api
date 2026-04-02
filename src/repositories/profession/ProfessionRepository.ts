import type { Prisma } from "@/generated/prisma/client.js";
import type {
  ProfessionInput,
  ProfessionOutput,
  ProfessionUpdate,
} from "@/models/types/Profession.type.js";
import { prisma } from "@/prisma.js";

import type { IProfessionRepository } from "./IProfessionRepository.js";

class ProfessionRepository implements IProfessionRepository {
  async create(profession: ProfessionInput): Promise<ProfessionOutput> {
    const newProfession = await prisma.profession.create({
      data: {
        name: profession.name,
        code: profession.code,
      },
    });

    return {
      id: newProfession.id,
      name: newProfession.name,
      code: newProfession.code,
      createdAt: newProfession.createdAt,
      updatedAt: newProfession.updatedAt,
    };
  }

  async update(
    id: number,
    profession: ProfessionUpdate,
  ): Promise<ProfessionOutput> {
    const data: Prisma.ProfessionUpdateInput = {};

    if (profession.name !== undefined) {
      data.name = profession.name;
    }

    if (profession.code !== undefined) {
      data.code = profession.code;
    }

    const result = await prisma.profession.update({
      where: { id },
      data,
    });

    return {
      id: result.id,
      name: result.name,
      code: result.code,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findAll(): Promise<ProfessionOutput[]> {
    const data = await prisma.profession.findMany();

    const professions: ProfessionOutput[] = data.map((profession) => {
      return {
        id: profession.id,
        name: profession.name,
        code: profession.code,
        createdAt: profession.createdAt,
        updatedAt: profession.updatedAt,
      };
    });

    return professions;
  }

  async delete(id: number): Promise<void> {
    await prisma.profession.deleteMany({
      where: { id },
    });
  }

  async findById(id: number): Promise<ProfessionOutput | null> {
    const profession = await prisma.profession.findUnique({ where: { id } });

    return profession
      ? {
          id: profession.id,
          name: profession.name,
          code: profession.code,
          createdAt: profession.createdAt,
          updatedAt: profession.updatedAt,
        }
      : null;
  }

  async findByName(name: string): Promise<ProfessionOutput | null> {
    const data = await prisma.profession.findUnique({ where: { name } });

    return data
      ? {
          id: data.id,
          name: data.name,
          code: data.code,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      : null;
  }
  async findByCode(code: string): Promise<ProfessionOutput | null> {
    const data = await prisma.profession.findUnique({ where: { code } });

    return data
      ? {
          id: data.id,
          name: data.name,
          code: data.code,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      : null;
  }

  async existsById(id: number): Promise<boolean> {
    const count = await prisma.profession.count({ where: { id } });
    return count > 0;
  }
}

export default ProfessionRepository;
