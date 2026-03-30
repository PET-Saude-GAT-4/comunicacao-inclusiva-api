/*
  Warnings:

  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Specialty" DROP CONSTRAINT "Specialty_professionId_fkey";

-- DropTable
DROP TABLE "Specialty";

-- CreateTable
CREATE TABLE "Speciality" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "professionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Speciality_code_key" ON "Speciality"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Speciality_name_professionId_key" ON "Speciality"("name", "professionId");

-- AddForeignKey
ALTER TABLE "Speciality" ADD CONSTRAINT "Speciality_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
