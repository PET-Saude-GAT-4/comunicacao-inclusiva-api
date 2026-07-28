-- CreateTable
CREATE TABLE "Interactionchain" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "triggerBoardUuid" TEXT NOT NULL,
    "responseBoardUuid" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interactionchain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interactionchain_uuid_key" ON "Interactionchain"("uuid");

-- AddForeignKey
ALTER TABLE "Interactionchain" ADD CONSTRAINT "Interactionchain_triggerBoardUuid_fkey" FOREIGN KEY ("triggerBoardUuid") REFERENCES "Board"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interactionchain" ADD CONSTRAINT "Interactionchain_responseBoardUuid_fkey" FOREIGN KEY ("responseBoardUuid") REFERENCES "Board"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
