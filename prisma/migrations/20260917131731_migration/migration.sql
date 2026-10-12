/*
  Warnings:

  - You are about to drop the `Interactionchain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interactionchain" DROP CONSTRAINT "Interactionchain_responseBoardUuid_fkey";

-- DropForeignKey
ALTER TABLE "Interactionchain" DROP CONSTRAINT "Interactionchain_triggerBoardUuid_fkey";

-- DropTable
DROP TABLE "Interactionchain";
