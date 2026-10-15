import type {
  PictogramListOutput,
  PictogramOutput,
} from "@/models/types/Pictogram.type.js";
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

export function toPictogramListResponse(pictogram: PictogramListOutput) {
  return { ...toPictogramResponse(pictogram), terms: pictogram.terms };
}
