-- CreateIndex
CREATE UNIQUE INDEX "BoardTerm_boardId_id_key" ON "BoardTerm"("boardId", "id");

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_id_first_fkey" FOREIGN KEY ("id", "first") REFERENCES "BoardTerm"("boardId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BoardTerm" ADD CONSTRAINT "BoardTerm_boardId_next_fkey" FOREIGN KEY ("boardId", "next") REFERENCES "BoardTerm"("boardId", "id") ON DELETE NO ACTION ON UPDATE NO ACTION;
