/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobTitleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jobTitleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Role";

-- CreateTable
CREATE TABLE "JobTitle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_name_key" ON "JobTitle"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
