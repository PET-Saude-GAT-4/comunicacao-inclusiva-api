-- Board.first changes meaning: it held a Pictogram.id, it now holds a BoardItem.id.
-- The column type is unchanged, so nothing below would clear it, and the stale ids
-- would silently address unrelated BoardItem rows. No BoardPictogram row can be
-- carried over either: a BoardItem needs a Term, Term.signWritingId is required and
-- no SignWriting exists yet, so the boards are rebuilt from the seed.
UPDATE "Board" SET "first" = NULL;

-- DropForeignKey
ALTER TABLE "BoardPictogram" DROP CONSTRAINT "BoardPictogram_boardId_fkey";

-- DropForeignKey
ALTER TABLE "BoardPictogram" DROP CONSTRAINT "BoardPictogram_pictogramId_fkey";

-- DropTable
DROP TABLE "BoardPictogram";

-- CreateTable
CREATE TABLE "BoardItem" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "termId" INTEGER NOT NULL,
    "next" INTEGER,

    CONSTRAINT "BoardItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardItem_uuid_key" ON "BoardItem"("uuid");

-- CreateIndex
CREATE INDEX "BoardItem_boardId_idx" ON "BoardItem"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardItem_boardId_termId_key" ON "BoardItem"("boardId", "termId");

-- AddForeignKey
ALTER TABLE "BoardItem" ADD CONSTRAINT "BoardItem_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardItem" ADD CONSTRAINT "BoardItem_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
