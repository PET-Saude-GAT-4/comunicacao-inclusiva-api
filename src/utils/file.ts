import type { FileType } from "@/models/types/StoredFile.type.js";
import { concatWithBaseUrl } from "@/utils/url.js";

export function buildFileUrl(fileUuid: string): string {
  return concatWithBaseUrl(`/files/${fileUuid}`);
}

export function mimeToFileType(mime: string): FileType {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";

  if (
    mime === "application/pdf" ||
    mime.includes("msword") ||
    mime.includes("officedocument") ||
    mime === "text/plain"
  )
    return "document";

  if (
    mime === "application/zip" ||
    mime === "application/x-tar" ||
    mime === "application/gzip" ||
    mime === "application/x-7z-compressed"
  )
    return "archive";

  return "other";
}
