import type { RequestHandler } from "express";

import type { FileType } from "@/models/types/StoredFile.type.js";

interface IFileMiddleware {
  validateSingleFile(props: {
    fieldName: string;
    required?: boolean;
    maxSize?: number;
    allowedFileTypes?: FileType[];
  }): RequestHandler[];

  validateManyFiles(
    files: {
      fieldName: string;
      required?: boolean;
      maxSize?: number;
      maxCount?: number;
      allowedFileTypes?: FileType[];
    }[],
  ): RequestHandler[];
}

export type { IFileMiddleware };
