import { NextFunction, Request, Response } from "express";

type ControllerFunction = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;

export const errorWrapper = (controller: ControllerFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
