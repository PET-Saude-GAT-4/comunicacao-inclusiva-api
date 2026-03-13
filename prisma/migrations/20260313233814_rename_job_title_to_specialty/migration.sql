/*
  Warnings:

  - You are about to drop the column `jobTitleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `JobTitle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `specialtyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_jobTitleId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "jobTitleId",
ADD COLUMN     "specialtyId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "JobTitle";

-- CreateTable
CREATE TABLE "Specialty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
