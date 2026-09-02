import { PrismaClient } from "@prisma/client/extension";

async function getPictogramByFileUuid(prisma: PrismaClient, fileUuid: string) {
  const storedFile = await prisma.storedFile.findUniqueOrThrow({
    where: { uuid: fileUuid },
  });
  return prisma.pictogram.findUniqueOrThrow({
    where: { storedFileId: storedFile.id },
  });
}

async function getTermByPictogramFileUuid(
  prisma: PrismaClient,
  fileUuid: string,
) {
  const pictogram = await getPictogramByFileUuid(prisma, fileUuid);
  return prisma.term.findFirstOrThrow({
    where: { pictogramId: pictogram.id },
  });
}

type BoardDef = {
  title: string;
  representativeFileUuid: string;
  pictogramFileUuids: string[];
};

const BOARD_DEFS: BoardDef[] = [
  {
    title: "Necessidades Básicas",
    representativeFileUuid: "8f1cb8c0-33fa-4dcf-ba16-74f0fc72db4e", // water
    pictogramFileUuids: [
      "8f1cb8c0-33fa-4dcf-ba16-74f0fc72db4e", // water
      "6650c5ab-c3f0-41e9-b9bc-150bc22ee942", // food
      "ec4d11e0-46da-4b17-aef6-fa9de793ebd8", // bathroom
      "6a5b8142-3ffe-448d-a5ac-1fc2790faad3", // sleep
      "8cf2ccef-68e2-468e-a7d4-a1d6ff010839", // rest
    ],
  },
  {
    title: "Emoções e Estado",
    representativeFileUuid: "0e924686-d36e-4ec3-8349-a04e067f83ed", // happy
    pictogramFileUuids: [
      "0e924686-d36e-4ec3-8349-a04e067f83ed", // happy
      "79640a6d-abfb-4cf5-b4ba-7bcdc20a6a6a", // sad
      "ad3a52aa-cc8a-4794-aa78-47d83716ab96", // afraid
      "44860c8f-1732-4494-84b3-b7cdacf4629a", // irritated
      "0b711353-ea84-40f9-b4ee-450db0a67692", // anxious
      "8d233177-2f1e-4b1e-b2ce-06dfb5383a38", // calm
      "870ea3c4-f595-4cc7-a61e-caafd216bbf2", // confused
    ],
  },
  {
    title: "Partes do Corpo",
    representativeFileUuid: "144705f7-1f6f-4260-b2d7-4db9ccddabb8", // body
    pictogramFileUuids: [
      "f55a4706-5c57-433f-a022-7abfe781fb1a", // head
      "ae62e148-7f8a-4d31-b559-dfb69f04e293", // eyes
      "8e7064fa-183e-410f-8b9e-fd6057257070", // ear
      "53a111bc-7447-41d0-a819-fba51de638ba", // nose
      "1a02261b-61f7-4477-97fc-e7ac04b2e15a", // mouth
      "c226bcc3-a6ea-498c-b229-f122efa1ded8", // tooth
      "ebd11386-6a8c-416b-aeab-3332764b4706", // throat
      "96bc5b14-102e-476f-9d23-015227717ceb", // lung
      "115de064-0766-41fd-bb1f-bb4990cb031e", // heart
      "723c9f9f-89bd-48e1-b237-07d3546618a4", // belly
      "d41d4bf9-193d-4b20-91ab-f5752e5eb7e2", // arm
      "6f825fab-26b2-44b9-862a-74bc1c2ccfdb", // leg
      "424fdefb-18cd-4645-b8ce-a66d2e0e5250", // foot
      "9ad5f99f-375d-4e75-a967-ce757dc1317e", // back
    ],
  },
  {
    title: "Sintomas Gerais",
    representativeFileUuid: "99b570da-8f1f-409a-9dc9-c8914a2cd900", // malaise
    pictogramFileUuids: [
      "4bdec2c8-170b-4f5b-85a0-7adc4c311c1e", // nausea
      "a36ab6c8-3da5-46c2-8390-9f73675b8e5b", // dizziness
      "75cb847b-9c76-45cb-9f70-5d0a2f72398f", // shortness-of-breath
      "2817a8f9-c558-46a4-8230-4c0399333da2", // fatigue
      "dc9a3a35-a2d1-4313-a366-3b885688f3fa", // fever
      "03648046-6607-4e16-adee-c2c93c9c1fa9", // tingling
    ],
  },
];

export async function seedBoards(prisma: PrismaClient): Promise<void> {
  for (const def of BOARD_DEFS) {
    const representative = await getPictogramByFileUuid(
      prisma,
      def.representativeFileUuid,
    );

    const terms = await Promise.all(
      def.pictogramFileUuids.map((uuid) =>
        getTermByPictogramFileUuid(prisma, uuid),
      ),
    );

    let board = await prisma.board.findFirst({ where: { title: def.title } });
    if (!board) {
      board = await prisma.board.create({
        data: {
          title: def.title,
          representativeId: representative.id,
          publishedAt: new Date(),
        },
      });
    } else {
      await prisma.board.update({
        where: { id: board.id },
        data: {
          representativeId: representative.id,
          publishedAt: board.publishedAt ?? new Date(),
        },
      });
    }

    // The chain is rebuilt from scratch so re-running the seed converges on the
    // definition above. Terms are created one at a time because the linked list
    // needs the generated ids, which createMany does not return.
    await prisma.boardTerm.deleteMany({ where: { boardId: board.id } });

    const boardTerms = [];
    for (const term of terms) {
      boardTerms.push(
        await prisma.boardTerm.create({
          data: { boardId: board.id, termId: term.id },
        }),
      );
    }

    for (let i = 0; i < boardTerms.length; i++) {
      await prisma.boardTerm.update({
        where: { id: boardTerms[i].id },
        data: { next: i + 1 < boardTerms.length ? boardTerms[i + 1].id : null },
      });
    }

    await prisma.board.update({
      where: { id: board.id },
      data: { first: boardTerms[0]?.id ?? null },
    });
  }
}
