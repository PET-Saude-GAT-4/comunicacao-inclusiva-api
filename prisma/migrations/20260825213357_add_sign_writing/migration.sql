-- CreateTable
CREATE TABLE "SignWriting" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "storedFileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignWriting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SignWriting_uuid_key" ON "SignWriting"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SignWriting_storedFileId_key" ON "SignWriting"("storedFileId");

-- AddForeignKey
ALTER TABLE "SignWriting" ADD CONSTRAINT "SignWriting_storedFileId_fkey" FOREIGN KEY ("storedFileId") REFERENCES "StoredFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
