-- DropIndex
DROP INDEX "InteractionChain_triggerBoardId_responseBoardId_key";

-- AlterTable
ALTER TABLE "InteractionChain" ADD COLUMN     "triggerPhraseId" INTEGER,
ALTER COLUMN "triggerBoardId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Phrase" ADD COLUMN     "listedInLibrary" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "InteractionChain_triggerPhraseId_rank_idx" ON "InteractionChain"("triggerPhraseId", "rank");

-- AddForeignKey
ALTER TABLE "InteractionChain" ADD CONSTRAINT "InteractionChain_triggerPhraseId_fkey" FOREIGN KEY ("triggerPhraseId") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Everything above is generated. Everything below is not: Prisma models
-- neither a CHECK nor a partial unique index, so these are written by hand and
-- schema.prisma does not fully describe this table.

-- The trigger is an exclusive arc: a board or a phrase, never both, never
-- neither. Every existing row carries a triggerBoardId, so this holds without a
-- backfill. A third trigger kind later only extends the call.
ALTER TABLE "InteractionChain"
  ADD CONSTRAINT "InteractionChain_trigger_arc"
  CHECK (num_nonnulls("triggerBoardId", "triggerPhraseId") = 1);

-- Replaces the composite unique dropped above, which cannot span a column that
-- is now optional. One partial index per kind keeps a trigger from pointing at
-- the same board twice.
CREATE UNIQUE INDEX "InteractionChain_triggerBoard_response_key"
  ON "InteractionChain" ("triggerBoardId", "responseBoardId")
  WHERE "triggerBoardId" IS NOT NULL;
CREATE UNIQUE INDEX "InteractionChain_triggerPhrase_response_key"
  ON "InteractionChain" ("triggerPhraseId", "responseBoardId")
  WHERE "triggerPhraseId" IS NOT NULL;
