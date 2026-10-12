-- DropForeignKey
ALTER TABLE "Interactionchain" DROP CONSTRAINT "Interactionchain_responseBoardUuid_fkey";

-- DropForeignKey
ALTER TABLE "Interactionchain" DROP CONSTRAINT "Interactionchain_triggerBoardUuid_fkey";

-- AddForeignKey
ALTER TABLE "Interactionchain" ADD CONSTRAINT "Interactionchain_triggerBoardUuid_fkey" FOREIGN KEY ("triggerBoardUuid") REFERENCES "Board"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interactionchain" ADD CONSTRAINT "Interactionchain_responseBoardUuid_fkey" FOREIGN KEY ("responseBoardUuid") REFERENCES "Board"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
