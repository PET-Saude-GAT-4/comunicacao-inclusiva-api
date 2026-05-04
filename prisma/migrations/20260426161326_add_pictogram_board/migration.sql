-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('image', 'video', 'audio', 'document', 'archive', 'other');

-- CreateTable
CREATE TABLE "StoredFile" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileSize" BIGINT,
    "mimeType" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "purpose" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoredFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pictogram" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "storedFileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pictogram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" INTEGER,
    "representativeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardPictogram" (
    "boardId" INTEGER NOT NULL,
    "pictogramId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "BoardPictogram_pkey" PRIMARY KEY ("boardId","pictogramId")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoredFile_uuid_key" ON "StoredFile"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "StoredFile_location_key" ON "StoredFile"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Pictogram_uuid_key" ON "Pictogram"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Pictogram_storedFileId_key" ON "Pictogram"("storedFileId");

-- CreateIndex
CREATE UNIQUE INDEX "Board_uuid_key" ON "Board"("uuid");

-- AddForeignKey
ALTER TABLE "StoredFile" ADD CONSTRAINT "StoredFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pictogram" ADD CONSTRAINT "Pictogram_storedFileId_fkey" FOREIGN KEY ("storedFileId") REFERENCES "StoredFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Pictogram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardPictogram" ADD CONSTRAINT "BoardPictogram_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardPictogram" ADD CONSTRAINT "BoardPictogram_pictogramId_fkey" FOREIGN KEY ("pictogramId") REFERENCES "Pictogram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
