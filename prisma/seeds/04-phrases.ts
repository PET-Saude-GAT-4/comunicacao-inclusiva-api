import { PrismaClient } from "@prisma/client/extension";

async function getPictogramByFileUuid(prisma: PrismaClient, fileUuid: string) {
  const storedFile = await prisma.storedFile.findUniqueOrThrow({
    where: { uuid: fileUuid },
  });
  return prisma.pictogram.findUniqueOrThrow({
    where: { storedFileId: storedFile.id },
  });
}

type PhraseDef = {
  description: string;
  pictogramFileUuids: string[];
};

// Store phrases are seeded without an author, so only a super_admin can manage
// them afterwards.
const PHRASE_DEFS: PhraseDef[] = [
  {
    description: "Estou com dor de cabeça",
    pictogramFileUuids: [
      "f55a4706-5c57-433f-a022-7abfe781fb1a", // head
      "99b570da-8f1f-409a-9dc9-c8914a2cd900", // malaise
    ],
  },
  {
    description: "Quero beber água",
    pictogramFileUuids: [
      "1a02261b-61f7-4477-97fc-e7ac04b2e15a", // mouth
      "8f1cb8c0-33fa-4dcf-ba16-74f0fc72db4e", // water
    ],
  },
  {
    description: "Estou com falta de ar",
    pictogramFileUuids: [
      "96bc5b14-102e-476f-9d23-015227717ceb", // lung
      "75cb847b-9c76-45cb-9f70-5d0a2f72398f", // shortness-of-breath
    ],
  },
  {
    description: "Estou com náusea e tontura",
    pictogramFileUuids: [
      "723c9f9f-89bd-48e1-b237-07d3546618a4", // belly
      "4bdec2c8-170b-4f5b-85a0-7adc4c311c1e", // nausea
      "a36ab6c8-3da5-46c2-8390-9f73675b8e5b", // dizziness
    ],
  },
  {
    description: "Estou cansado e quero descansar",
    pictogramFileUuids: [
      "2817a8f9-c558-46a4-8230-4c0399333da2", // fatigue
      "8cf2ccef-68e2-468e-a7d4-a1d6ff010839", // rest
    ],
  },
  {
    description: "Preciso ir ao banheiro",
    pictogramFileUuids: [
      "ec4d11e0-46da-4b17-aef6-fa9de793ebd8", // bathroom
    ],
  },
];

export async function seedPhrases(prisma: PrismaClient): Promise<void> {
  for (const def of PHRASE_DEFS) {
    const pictograms = await Promise.all(
      def.pictogramFileUuids.map((uuid) =>
        getPictogramByFileUuid(prisma, uuid),
      ),
    );

    let phrase = await prisma.phrase.findFirst({
      where: { description: def.description },
    });

    if (!phrase) {
      phrase = await prisma.phrase.create({
        data: {
          description: def.description,
          publishedAt: new Date(),
        },
      });
    } else {
      await prisma.phrase.update({
        where: { id: phrase.id },
        data: { publishedAt: phrase.publishedAt ?? new Date() },
      });
    }

    // The sequence is rebuilt from scratch so re-running the seed converges on
    // the definition above.
    await prisma.phrasePictogram.deleteMany({ where: { phraseId: phrase.id } });

    await prisma.phrasePictogram.createMany({
      data: pictograms.map((pictogram, index) => ({
        phraseId: phrase.id,
        pictogramId: pictogram.id,
        order: index + 1,
      })),
    });
  }
}
