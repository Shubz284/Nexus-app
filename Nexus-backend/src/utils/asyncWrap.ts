import { NextFunction, Request, Response } from "express";

export function asyncWrap(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
}
