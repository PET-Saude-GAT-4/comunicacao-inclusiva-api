-- CreateTable
CREATE TABLE "InteractionChain" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "triggerBoardId" INTEGER NOT NULL,
    "responseBoardId" INTEGER NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InteractionChain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InteractionChain_uuid_key" ON "InteractionChain"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "InteractionChain_triggerBoardId_responseBoardId_key" ON "InteractionChain"("triggerBoardId", "responseBoardId");

-- AddForeignKey
ALTER TABLE "InteractionChain" ADD CONSTRAINT "InteractionChain_triggerBoardId_fkey" FOREIGN KEY ("triggerBoardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionChain" ADD CONSTRAINT "InteractionChain_responseBoardId_fkey" FOREIGN KEY ("responseBoardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
