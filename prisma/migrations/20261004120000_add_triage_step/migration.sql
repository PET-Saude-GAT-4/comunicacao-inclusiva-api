-- CreateTable
CREATE TABLE "TriageStep" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "boardType" "BoardType" NOT NULL DEFAULT 'emergency',
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TriageStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TriageStep_uuid_key" ON "TriageStep"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "TriageStep_boardId_key" ON "TriageStep"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "TriageStep_level_key" ON "TriageStep"("level");

-- CreateIndex
CREATE UNIQUE INDEX "TriageStep_boardId_boardType_key" ON "TriageStep"("boardId", "boardType");

-- CreateIndex
CREATE UNIQUE INDEX "Board_id_type_key" ON "Board"("id", "type");

-- AddForeignKey
ALTER TABLE "TriageStep" ADD CONSTRAINT "TriageStep_boardId_boardType_fkey" FOREIGN KEY ("boardId", "boardType") REFERENCES "Board"("id", "type") ON DELETE RESTRICT ON UPDATE RESTRICT;



-- Everything above is generated. Everything below is not: Prisma models
-- neither a CHECK nor a deferrable constraint, so these are written by hand
-- and schema.prisma does not fully describe this table.

-- There are always exactly five triage levels.
ALTER TABLE "TriageStep"
  ADD CONSTRAINT "TriageStep_level_range"
  CHECK ("level" BETWEEN 1 AND 5);

-- Only an emergency board can be a triage step. The composite foreign key above
-- makes boardType equal the board's type and, with ON UPDATE RESTRICT, rejects
-- retyping a board while it is a step; this pins that type to emergency. Its ON
-- DELETE RESTRICT likewise rejects deleting the board, so a level is only ever
-- emptied on purpose.
ALTER TABLE "TriageStep"
  ADD CONSTRAINT "TriageStep_board_is_emergency"
  CHECK ("boardType" = 'emergency');

-- Replaces the plain unique index on level with a constraint of the same name
-- that can be checked at the end of a transaction instead of row by row, which
-- swapping two boards' levels needs. It stays immediate unless a transaction
-- defers it, so every other write is still checked as it happens.
DROP INDEX "TriageStep_level_key";
ALTER TABLE "TriageStep"
  ADD CONSTRAINT "TriageStep_level_key" UNIQUE ("level")
  DEFERRABLE INITIALLY IMMEDIATE;
