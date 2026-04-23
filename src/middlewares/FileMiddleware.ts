import type { NextFunction, Request, RequestHandler, Response } from "express";
import { fileTypeFromBuffer } from "file-type";
import multer from "multer";

import { BadRequestError } from "@/errors/BadRequestError.js";
import type { FileType } from "@/models/types/StoredFile.type.js";
import { mimeToFileType } from "@/utils/file.js";

import type { IFileMiddleware } from "./IFileMiddleware.js";

const storage = multer.memoryStorage();
const storageEngine = multer({ storage });

class FileMiddleware implements IFileMiddleware {
  public validateSingleFile({
    fieldName,
    required = false,
    maxSize = 2 * 1024 * 1024,
    allowedFileTypes,
  }: {
    fieldName: string;
    required?: boolean;
    maxSize?: number;
    allowedFileTypes?: FileType[];
  }): RequestHandler[] {
    const validate = async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      if (!req.file) {
        if (required) throw new BadRequestError(`${fieldName} not sent.`);
        return next();
      }

      if (req.file.size > maxSize)
        throw new BadRequestError("This file is too big.");

      const fileType = await fileTypeFromBuffer(req.file.buffer);

      if (!fileType)
        throw new BadRequestError(
          "The uploaded file has an invalid file type.",
        );

      if (allowedFileTypes && allowedFileTypes.length > 0) {
        const type = mimeToFileType(fileType.mime);
        if (!allowedFileTypes.includes(type))
          throw new BadRequestError(
            "The uploaded file has an invalid file type.",
          );
      }

      req.file.mimetype = fileType.mime;

      return next();
    };

    return [storageEngine.single(fieldName), validate];
  }

  public validateManyFiles(
    fields: {
      fieldName: string;
      required?: boolean;
      maxSize?: number;
      maxCount?: number;
      allowedFileTypes?: FileType[];
    }[],
  ): RequestHandler[] {
    const validate = async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      for (const {
        fieldName,
        required = false,
        maxSize = 2 * 1024 * 1024,
        maxCount,
        allowedFileTypes,
      } of fields) {
        const files = (req.files as Record<string, Express.Multer.File[]>)?.[
          fieldName
        ];

        if (!files || files.length === 0) {
          if (required) throw new BadRequestError(`${fieldName} not sent.`);
          continue;
        }

        if (maxCount !== undefined && files.length > maxCount)
          throw new BadRequestError(
            `The limit for ${fieldName} is ${maxCount} files.`,
          );

        for (const file of files) {
          if (file.size > maxSize)
            throw new BadRequestError(`File too large for ${fieldName}.`);

          const fileType = await fileTypeFromBuffer(file.buffer);

          if (!fileType)
            throw new BadRequestError(
              `At least one of the uploaded files for ${fieldName} has an invalid file type.`,
            );

          if (allowedFileTypes && allowedFileTypes.length > 0) {
            const type = mimeToFileType(fileType.mime);
            if (!allowedFileTypes.includes(type))
              throw new BadRequestError(
                `At least one of the uploaded files for ${fieldName} has an invalid file type.`,
              );
          }

          file.mimetype = fileType.mime;
        }
      }

      return next();
    };

    return [
      storageEngine.fields(
        fields.map((f) => ({ name: f.fieldName, maxCount: f.maxCount })),
      ),
      validate,
    ];
  }
}

export default FileMiddleware;
