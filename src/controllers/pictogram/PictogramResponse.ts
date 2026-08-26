import type { PictogramOutput } from "@/models/types/Pictogram.type.js";
import { buildFileUrl } from "@/utils/file.js";

export function toPictogramResponse(pictogram: PictogramOutput) {
  return {
    uuid: pictogram.uuid,
    description: pictogram.description,
    fileUrl: buildFileUrl(pictogram.fileUuid),
    createdAt: pictogram.createdAt,
    updatedAt: pictogram.updatedAt,
  };
}
