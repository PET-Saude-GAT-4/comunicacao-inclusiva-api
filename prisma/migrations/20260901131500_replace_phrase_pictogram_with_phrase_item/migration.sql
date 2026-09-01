-- DropForeignKey
ALTER TABLE "PhrasePictogram" DROP CONSTRAINT "PhrasePictogram_phraseId_fkey";

-- DropForeignKey
ALTER TABLE "PhrasePictogram" DROP CONSTRAINT "PhrasePictogram_pictogramId_fkey";

-- DropTable
DROP TABLE "PhrasePictogram";

-- CreateTable
CREATE TABLE "PhraseItem" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "phraseId" INTEGER NOT NULL,
    "termId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PhraseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhraseItem_uuid_key" ON "PhraseItem"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PhraseItem_phraseId_order_key" ON "PhraseItem"("phraseId", "order");

-- AddForeignKey
ALTER TABLE "PhraseItem" ADD CONSTRAINT "PhraseItem_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhraseItem" ADD CONSTRAINT "PhraseItem_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

