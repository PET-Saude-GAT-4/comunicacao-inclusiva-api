import type { Prisma } from "@/generated/prisma/client.js";
import { Profession } from "@/models/Profession.js";
import { prisma } from "@/prisma.js";

import type { IProfessionRepository } from "./IProfessionRepository.js";

class ProfessionRepository implements IProfessionRepository {
  async create(profession: Profession): Promise<Profession> {
    const data = await prisma.profession.create({
      data: {
        name: profession.name,
        code: profession.code,
      },
    });

    return new Profession(data.id, data.code, data.name);
  }

  async update(
    id: number,
    profession: Partial<Profession>,
  ): Promise<Profession> {
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

    return new Profession(result.id, result.code, result.name);
  }

  async findAll(): Promise<Profession[]> {
    const data = await prisma.profession.findMany();

    const professions: Profession[] = data.map((profession) => {
      return new Profession(profession.id, profession.code, profession.name);
    });

    return professions;
  }

  async delete(id: number): Promise<void> {
    await prisma.profession.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<Profession | null> {
    const data = await prisma.profession.findUnique({ where: { id } });

    return data ? new Profession(data.id, data.code, data.name) : null;
  }

  async findByName(name: string): Promise<Profession | null> {
    const data = await prisma.profession.findUnique({ where: { name } });

    return data ? new Profession(data.id, data.code, data.name) : null;
  }
  async findByCode(code: string): Promise<Profession | null> {
    const data = await prisma.profession.findUnique({ where: { code } });

    return data ? new Profession(data.id, data.code, data.name) : null;
  }
}

export default ProfessionRepository;
