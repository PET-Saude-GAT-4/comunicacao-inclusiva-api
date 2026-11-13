import { PrismaClient } from "@prisma/client/extension";

type ProfessionDef = {
  code: string;
  name: string;
  specialities: { code: string; name: string }[];
};

// The app cannot start a consultation without a profession, so a fresh
// database needs at least these. Codes match the app's offline mocks, which a
// professional's saved history refers to. A profession with no speciality is
// fine: the app offers a default "Geral" one.
const PROFESSION_DEFS: ProfessionDef[] = [
  {
    code: "MED",
    name: "Médico",
    specialities: [
      { code: "CAR", name: "Cardiologia" },
      { code: "PED", name: "Pediatria" },
    ],
  },
  {
    code: "ENF",
    name: "Enfermeiro",
    specialities: [{ code: "PED-NEO", name: "Pediatria Neonatal" }],
  },
  {
    code: "DEN",
    name: "Dentista",
    specialities: [{ code: "ODO-PED", name: "Odontopediatria" }],
  },
  { code: "FON", name: "Fonoaudiólogo", specialities: [] },
];

// Rows are addressed by code, so running the seed again renames instead of
// duplicating, and leaves professions added in the dashboard alone.
export async function seedProfessions(prisma: PrismaClient): Promise<void> {
  for (const def of PROFESSION_DEFS) {
    const profession = await prisma.profession.upsert({
      where: { code: def.code },
      update: { name: def.name },
      create: { code: def.code, name: def.name },
    });

    for (const speciality of def.specialities) {
      await prisma.speciality.upsert({
        where: { code: speciality.code },
        update: { name: speciality.name, professionId: profession.id },
        create: {
          code: speciality.code,
          name: speciality.name,
          professionId: profession.id,
        },
      });
    }
  }
}
