-- AlterTable
-- Added with a temporary default so the column can be NOT NULL on a non-empty table.
ALTER TABLE "InteractionChain" ADD COLUMN "rank" INTEGER NOT NULL DEFAULT 0;

-- Backfill: existing edges keep their current relative order (oldest authored first),
-- ranked 1..n within each trigger board.
UPDATE "InteractionChain" ic
SET "rank" = sub.rn
FROM (
    SELECT "id",
           ROW_NUMBER() OVER (PARTITION BY "triggerBoardId"
                              ORDER BY "createdAt" ASC, "id" ASC) AS rn
    FROM "InteractionChain"
) sub
WHERE ic."id" = sub."id";

ALTER TABLE "InteractionChain" ALTER COLUMN "rank" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "InteractionChain_triggerBoardId_rank_idx" ON "InteractionChain"("triggerBoardId", "rank");
