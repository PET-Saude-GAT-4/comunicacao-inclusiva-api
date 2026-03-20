import type { Prisma } from "@/generated/prisma/client.js";
import type { ProfessionCreateInput } from "@/generated/prisma/models.js";
import { Profession } from "@/models/Profession.js";
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
    };
  }

  async findAll(): Promise<ProfessionOutput[]> {
    const data = await prisma.profession.findMany();

    const professions: ProfessionOutput[] = data.map((profession) => {
      return {
        id: profession.id,
        name: profession.name,
        code: profession.code,
      };
    });

    return professions;
  }

  async delete(id: number): Promise<void> {
    await prisma.profession.delete({
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
        }
      : null;
  }

  async findByName(name: string): Promise<ProfessionOutput | null> {
    const data = await prisma.profession.findUnique({ where: { name } });

    return data ? { id: data.id, name: data.name, code: data.code } : null;
  }
  async findByCode(code: string): Promise<ProfessionOutput | null> {
    const data = await prisma.profession.findUnique({ where: { code } });

    return data ? { id: data.id, name: data.name, code: data.code } : null;
  }

  async existsById(id: number): Promise<boolean> {
    const count = await prisma.profession.count({ where: { id } });
    return count > 0;
  }
}

export default ProfessionRepository;
