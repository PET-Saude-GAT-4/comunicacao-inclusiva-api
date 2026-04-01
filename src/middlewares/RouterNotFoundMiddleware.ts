import type { NextFunction, Request, Response } from "express";

import { NotFoundError } from "@/errors/NotFoundError.js";

class RouterNotFoundMiddleware {
  public handle(req: Request, res: Response, next: NextFunction): void {
    next(new NotFoundError());
  }
}

export default RouterNotFoundMiddleware;
