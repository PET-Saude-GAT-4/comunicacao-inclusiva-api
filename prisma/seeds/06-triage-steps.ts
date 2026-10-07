import { PrismaClient } from "@prisma/client/extension";

// A step is addressed by its level and its board's title, not by an id, so the
// seed converges on these definitions however many times it runs.
type TriageStepDef = {
  level: number;
  boardTitle: string;
};

// Levels 4 and 5 stay empty until their boards exist; the app shows the
// levels that are filled.
const TRIAGE_STEP_DEFS: TriageStepDef[] = [
  { level: 1, boardTitle: "Triagem Nível 1" },
  { level: 2, boardTitle: "Triagem Nível 2" },
  { level: 3, boardTitle: "Triagem Nível 3" },
];

export async function seedTriageSteps(prisma: PrismaClient): Promise<void> {
  for (const def of TRIAGE_STEP_DEFS) {
    const board = await prisma.board.findFirstOrThrow({
      where: { title: def.boardTitle },
    });

    const current = await prisma.triageStep.findUnique({
      where: { level: def.level },
    });

    if (current?.boardId === board.id) continue;

    // Clears whatever holds this level and wherever this board sits, so the
    // create below meets neither unique constraint.
    await prisma.triageStep.deleteMany({
      where: { OR: [{ level: def.level }, { boardId: board.id }] },
    });

    await prisma.triageStep.create({
      data: { boardId: board.id, level: def.level },
    });
  }
}
