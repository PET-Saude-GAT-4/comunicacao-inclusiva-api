-- CreateTable
CREATE TABLE "Phrase" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhrasePictogram" (
    "id" SERIAL NOT NULL,
    "phraseId" INTEGER NOT NULL,
    "pictogramId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PhrasePictogram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Phrase_uuid_key" ON "Phrase"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PhrasePictogram_phraseId_order_key" ON "PhrasePictogram"("phraseId", "order");

-- AddForeignKey
ALTER TABLE "Phrase" ADD CONSTRAINT "Phrase_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhrasePictogram" ADD CONSTRAINT "PhrasePictogram_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhrasePictogram" ADD CONSTRAINT "PhrasePictogram_pictogramId_fkey" FOREIGN KEY ("pictogramId") REFERENCES "Pictogram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
