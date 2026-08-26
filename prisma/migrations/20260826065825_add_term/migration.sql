-- CreateTable
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pictogramId" INTEGER NOT NULL,
    "signWritingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Term_uuid_key" ON "Term"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Term_pictogramId_signWritingId_key" ON "Term"("pictogramId", "signWritingId");

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_pictogramId_fkey" FOREIGN KEY ("pictogramId") REFERENCES "Pictogram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_signWritingId_fkey" FOREIGN KEY ("signWritingId") REFERENCES "SignWriting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
