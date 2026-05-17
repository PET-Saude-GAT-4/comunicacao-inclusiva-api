/*
  Warnings:

  - You are about to drop the column `order` on the `BoardPictogram` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "first" INTEGER;

-- AlterTable
ALTER TABLE "BoardPictogram" DROP COLUMN "order",
ADD COLUMN     "next" INTEGER;
