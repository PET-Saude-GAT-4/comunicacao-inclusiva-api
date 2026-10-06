import { toBoardResponse } from "@/controllers/board/BoardResponse.js";
import type { TriageStepOutput } from "@/models/types/TriageStep.type.js";

/// The board answers in the shared board shape, so the app reads a step's board
/// with the same adapter it uses for every other board.
export function toTriageStepResponse(triageStep: TriageStepOutput) {
  return {
    uuid: triageStep.uuid,
    level: triageStep.level,
    board: toBoardResponse(triageStep.board),
    createdAt: triageStep.createdAt,
    updatedAt: triageStep.updatedAt,
  };
}
