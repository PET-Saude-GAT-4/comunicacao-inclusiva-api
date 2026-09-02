-- DropForeignKey
ALTER TABLE "PhrasePictogram" DROP CONSTRAINT "PhrasePictogram_phraseId_fkey";

-- DropForeignKey
ALTER TABLE "PhrasePictogram" DROP CONSTRAINT "PhrasePictogram_pictogramId_fkey";

-- DropTable
DROP TABLE "PhrasePictogram";

-- CreateTable
CREATE TABLE "PhraseTerm" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "phraseId" INTEGER NOT NULL,
    "termId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PhraseTerm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhraseTerm_uuid_key" ON "PhraseTerm"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PhraseTerm_phraseId_order_key" ON "PhraseTerm"("phraseId", "order");

-- AddForeignKey
ALTER TABLE "PhraseTerm" ADD CONSTRAINT "PhraseTerm_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhraseTerm" ADD CONSTRAINT "PhraseTerm_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

