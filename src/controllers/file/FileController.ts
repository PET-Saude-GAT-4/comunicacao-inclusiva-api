import type { NextFunction, Request, Response } from "express";
import fs from "fs";
import { z } from "zod";

import FileService from "@/services/file/FileService.js";
import type { IFileService } from "@/services/file/IFileService.js";

import type { IFileController } from "./IFileController.js";

type Props = {
  fileService?: IFileService;
};

class FileController implements IFileController {
  private _fileService: IFileService;

  constructor(props?: Props) {
    this._fileService = props?.fileService ?? new FileService();
  }

  public async stream(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<unknown> {
    const { uuid } = req.params;

    const parsedUuid = z.uuid().parse(uuid);

    const file = await this._fileService.find(parsedUuid);

    if (!file) return res.status(404).send({ message: "File not found." });

    const etag = `${uuid}-${file.updatedAt.getTime()}`;

    if (req.headers["if-none-match"] === etag) {
      return res.status(304).end();
    }

    const readStream = fs.createReadStream(file.getFullLocation());

    readStream.on("error", () => {
      res.status(404).send({ message: "File not found." });
    });

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.originalName}"`,
    );
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.setHeader("ETag", etag);

    return readStream.pipe(res);
  }
}

export default FileController;
