import type { NextFunction, Request, Response } from "express";

import { ErrorBase } from "@/errors/base.error.js";
import { InternalServerError } from "@/errors/InternalServer.error.js";

class ErrorHandlerMiddleware {
  public handle = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    console.error(error);
    if (error instanceof ErrorBase) {
      error.send(res);
      return;
    }
    new InternalServerError().send(res);
  };
}

export default ErrorHandlerMiddleware;