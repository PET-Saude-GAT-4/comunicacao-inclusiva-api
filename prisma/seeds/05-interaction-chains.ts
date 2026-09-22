import { PrismaClient } from "@prisma/client/extension";

// A chain is addressed by what it connects, not by an id, so the seed can
// converge on these definitions however many times it runs.
type BoardChainDef = {
  triggerBoardTitle: string;
  responseBoardTitles: string[];
};

type PhraseChainDef = {
  triggerPhraseDescription: string;
  responseBoardTitles: string[];
};

// Mirrors the app's nextBoardsMock, so a seeded database and the development
// fixtures suggest the same boards.
const BOARD_CHAIN_DEFS: BoardChainDef[] = [
  {
    triggerBoardTitle: "Partes do Corpo",
    responseBoardTitles: ["Sintomas Gerais"],
  },
  {
    triggerBoardTitle: "Sintomas Gerais",
    responseBoardTitles: ["Partes do Corpo"],
  },
];

// A phrase names a complaint, so the boards worth suggesting next are the ones
// that refine it: the body part and the symptom list.
const PHRASE_CHAIN_DEFS: PhraseChainDef[] = [
  {
    triggerPhraseDescription: "Estou com dor de cabeça",
    responseBoardTitles: ["Partes do Corpo", "Sintomas Gerais"],
  },
  {
    triggerPhraseDescription: "Estou com falta de ar",
    responseBoardTitles: ["Sintomas Gerais", "Partes do Corpo"],
  },
  {
    triggerPhraseDescription: "Estou com náusea e tontura",
    responseBoardTitles: ["Sintomas Gerais"],
  },
  {
    triggerPhraseDescription: "Dor de cabeça",
    responseBoardTitles: ["Sintomas Gerais"],
  },
];

async function getBoardIdByTitle(
  prisma: PrismaClient,
  title: string,
): Promise<number> {
  const board = await prisma.board.findFirstOrThrow({ where: { title } });
  return board.id;
}

async function resolveResponseBoardIds(
  prisma: PrismaClient,
  titles: string[],
): Promise<number[]> {
  return Promise.all(titles.map((title) => getBoardIdByTitle(prisma, title)));
}

// `where` selects the one list being rebuilt, `trigger` writes it. Keeping them
// together is what makes the exclusive arc impossible to half-set here.
async function replaceChains(
  prisma: PrismaClient,
  where: { triggerBoardId: number } | { triggerPhraseId: number },
  responseBoardIds: number[],
): Promise<void> {
  await prisma.interactionChain.deleteMany({ where });

  await prisma.interactionChain.createMany({
    data: responseBoardIds.map((responseBoardId, index) => ({
      ...where,
      responseBoardId,
      rank: index + 1,
    })),
  });
}

export async function seedInteractionChains(
  prisma: PrismaClient,
): Promise<void> {
  for (const def of BOARD_CHAIN_DEFS) {
    const triggerBoardId = await getBoardIdByTitle(
      prisma,
      def.triggerBoardTitle,
    );
    const responseBoardIds = await resolveResponseBoardIds(
      prisma,
      def.responseBoardTitles,
    );

    await replaceChains(prisma, { triggerBoardId }, responseBoardIds);
  }

  for (const def of PHRASE_CHAIN_DEFS) {
    const phrase = await prisma.phrase.findFirstOrThrow({
      where: { description: def.triggerPhraseDescription },
    });
    const responseBoardIds = await resolveResponseBoardIds(
      prisma,
      def.responseBoardTitles,
    );

    await replaceChains(
      prisma,
      { triggerPhraseId: phrase.id },
      responseBoardIds,
    );
  }
}
