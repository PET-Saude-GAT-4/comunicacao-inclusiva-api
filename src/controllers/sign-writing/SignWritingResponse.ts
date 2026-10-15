import type {
  SignWritingListOutput,
  SignWritingOutput,
} from "@/models/types/SignWriting.type.js";
import { buildFileUrl } from "@/utils/file.js";

export function toSignWritingResponse(signWriting: SignWritingOutput) {
  return {
    uuid: signWriting.uuid,
    description: signWriting.description,
    fileUrl: buildFileUrl(signWriting.fileUuid),
    createdAt: signWriting.createdAt,
    updatedAt: signWriting.updatedAt,
  };
}

export function toSignWritingListResponse(signWriting: SignWritingListOutput) {
  return { ...toSignWritingResponse(signWriting), terms: signWriting.terms };
}
