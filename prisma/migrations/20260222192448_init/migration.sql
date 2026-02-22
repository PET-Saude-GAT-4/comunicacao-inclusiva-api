-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('image', 'audio', 'video', 'document', 'archive', 'other');

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoredFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "profilePictureId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pictogram" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pictogram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "representativePictogramId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER,
    "representativePictogramId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PictogramBoard" (
    "pictogramId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PictogramBoard_pkey" PRIMARY KEY ("pictogramId","boardId")
);

-- CreateTable
CREATE TABLE "UserBoard" (
    "userId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBoard_pkey" PRIMARY KEY ("userId","boardId")
);

-- CreateTable
CREATE TABLE "EmergencyBoard" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PictogramEmergencyBoard" (
    "pictogramId" INTEGER NOT NULL,
    "emergencyBoardId" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PictogramEmergencyBoard_pkey" PRIMARY KEY ("pictogramId","emergencyBoardId")
);

-- CreateTable
CREATE TABLE "QuickEmergencyBoard" (
    "emergencyBoardId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuickEmergencyBoard_pkey" PRIMARY KEY ("emergencyBoardId")
);

-- CreateTable
CREATE TABLE "CategorizedEmergencyBoard" (
    "emergencyBoardId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategorizedEmergencyBoard_pkey" PRIMARY KEY ("emergencyBoardId")
);

-- CreateTable
CREATE TABLE "Phrase" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PictogramPhrase" (
    "phraseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PictogramPhrase_pkey" PRIMARY KEY ("phraseId")
);

-- CreateTable
CREATE TABLE "PictogramPictogramPhrase" (
    "pictogramId" INTEGER NOT NULL,
    "pictogramPhraseId" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PictogramPictogramPhrase_pkey" PRIMARY KEY ("pictogramId","pictogramPhraseId")
);

-- CreateTable
CREATE TABLE "LibrasPhrase" (
    "phraseId" INTEGER NOT NULL,
    "representationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibrasPhrase_pkey" PRIMARY KEY ("phraseId")
);

-- CreateTable
CREATE TABLE "UserPhrase" (
    "userId" INTEGER NOT NULL,
    "phraseId" INTEGER NOT NULL,
    "isFavourite" BOOLEAN NOT NULL DEFAULT false,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPhrase_pkey" PRIMARY KEY ("userId","phraseId")
);

-- CreateTable
CREATE TABLE "_PhraseSequence" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PhraseSequence_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoredFile_uuid_key" ON "StoredFile"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "StoredFile_location_key" ON "StoredFile"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Person_uuid_key" ON "Person"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Person_cpf_key" ON "Person"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_profilePictureId_key" ON "User"("profilePictureId");

-- CreateIndex
CREATE UNIQUE INDEX "Pictogram_uuid_key" ON "Pictogram"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Pictogram_imageId_key" ON "Pictogram"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_uuid_key" ON "Category"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Board_uuid_key" ON "Board"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PictogramBoard_boardId_displayOrder_key" ON "PictogramBoard"("boardId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyBoard_uuid_key" ON "EmergencyBoard"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PictogramEmergencyBoard_emergencyBoardId_displayOrder_key" ON "PictogramEmergencyBoard"("emergencyBoardId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "QuickEmergencyBoard_userId_key" ON "QuickEmergencyBoard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Phrase_uuid_key" ON "Phrase"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Phrase_description_key" ON "Phrase"("description");

-- CreateIndex
CREATE UNIQUE INDEX "PictogramPictogramPhrase_pictogramPhraseId_displayOrder_key" ON "PictogramPictogramPhrase"("pictogramPhraseId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "LibrasPhrase_representationId_key" ON "LibrasPhrase"("representationId");

-- CreateIndex
CREATE INDEX "_PhraseSequence_B_index" ON "_PhraseSequence"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "StoredFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pictogram" ADD CONSTRAINT "Pictogram_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "StoredFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_representativePictogramId_fkey" FOREIGN KEY ("representativePictogramId") REFERENCES "Pictogram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_representativePictogramId_fkey" FOREIGN KEY ("representativePictogramId") REFERENCES "Pictogram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PictogramBoard" ADD CONSTRAINT "PictogramBoard_pictogramId_fkey" FOREIGN KEY ("pictogramId") REFERENCES "Pictogram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PictogramBoard" ADD CONSTRAINT "PictogramBoard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBoard" ADD CONSTRAINT "UserBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBoard" ADD CONSTRAINT "UserBoard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PictogramEmergencyBoard" ADD CONSTRAINT "PictogramEmergencyBoard_pictogramId_fkey" FOREIGN KEY ("pictogramId") REFERENCES "Pictogram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PictogramEmergencyBoard" ADD CONSTRAINT "PictogramEmergencyBoard_emergencyBoardId_fkey" FOREIGN KEY ("emergencyBoardId") REFERENCES "EmergencyBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickEmergencyBoard" ADD CONSTRAINT "QuickEmergencyBoard_emergencyBoardId_fkey" FOREIGN KEY ("emergencyBoardId") REFERENCES "EmergencyBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickEmergencyBoard" ADD CONSTRAINT "QuickEmergencyBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorizedEmergencyBoard" ADD CONSTRAINT "CategorizedEmergencyBoard_emergencyBoardId_fkey" FOREIGN KEY ("emergencyBoardId") REFERENCES "EmergencyBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorizedEmergencyBoard" ADD CONSTRAINT "CategorizedEmergencyBoard_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PictogramPhrase" ADD CONSTRAINT "PictogramPhrase_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PictogramPictogramPhrase" ADD CONSTRAINT "PictogramPictogramPhrase_pictogramId_fkey" FOREIGN KEY ("pictogramId") REFERENCES "Pictogram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PictogramPictogramPhrase" ADD CONSTRAINT "PictogramPictogramPhrase_pictogramPhraseId_fkey" FOREIGN KEY ("pictogramPhraseId") REFERENCES "PictogramPhrase"("phraseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibrasPhrase" ADD CONSTRAINT "LibrasPhrase_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibrasPhrase" ADD CONSTRAINT "LibrasPhrase_representationId_fkey" FOREIGN KEY ("representationId") REFERENCES "StoredFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPhrase" ADD CONSTRAINT "UserPhrase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPhrase" ADD CONSTRAINT "UserPhrase_phraseId_fkey" FOREIGN KEY ("phraseId") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhraseSequence" ADD CONSTRAINT "_PhraseSequence_A_fkey" FOREIGN KEY ("A") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhraseSequence" ADD CONSTRAINT "_PhraseSequence_B_fkey" FOREIGN KEY ("B") REFERENCES "Phrase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
