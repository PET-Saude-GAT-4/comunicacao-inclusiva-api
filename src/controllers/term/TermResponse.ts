import { toPictogramResponse } from "@/controllers/pictogram/PictogramResponse.js";
import { toSignWritingResponse } from "@/controllers/sign-writing/SignWritingResponse.js";
import type { TermOutput } from "@/models/types/Term.type.js";

export function toTermResponse(term: TermOutput) {
  return {
    uuid: term.uuid,
    description: term.description,
    pictogram: toPictogramResponse(term.pictogram),
    signWriting: toSignWritingResponse(term.signWriting),
    createdAt: term.createdAt,
    updatedAt: term.updatedAt,
  };
}

// A placement of a Term on a board or in a phrase. `uuid` addresses the placement
// (what you reorder or delete), `termUuid` the vocabulary entry.
export function toItemResponse(itemUuid: string, term: TermOutput) {
  return {
    uuid: itemUuid,
    termUuid: term.uuid,
    description: term.description,
    pictogram: toPictogramResponse(term.pictogram),
    signWriting: toSignWritingResponse(term.signWriting),
  };
}
