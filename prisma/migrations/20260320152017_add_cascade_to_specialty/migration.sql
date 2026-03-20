-- DropForeignKey
ALTER TABLE "Specialty" DROP CONSTRAINT "Specialty_professionId_fkey";

-- AddForeignKey
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
