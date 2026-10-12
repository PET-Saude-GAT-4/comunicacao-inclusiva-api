import { toPictogramResponse } from "@/controllers/pictogram/PictogramResponse.js";
import type { BoardOutput } from "@/models/types/Board.type.js";

/// Shared so the phrase's next-boards endpoint answers in the same shape as the
/// board's, which is what lets the app reuse one adapter for both.
export function toBoardResponse(board: BoardOutput) {
  return {
    uuid: board.uuid,
    title: board.title,
    type: board.type,
    authorUuid: board.authorUuid,
    representativePictogram: toPictogramResponse(board.representativePictogram),
    termCount: board.termCount,
    publishedAt: board.publishedAt,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  };
}
