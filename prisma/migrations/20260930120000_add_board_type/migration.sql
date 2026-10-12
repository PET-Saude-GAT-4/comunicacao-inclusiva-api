-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('common', 'emergency');

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "type" "BoardType" NOT NULL DEFAULT 'common';
