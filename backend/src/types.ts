import { NextFunction, Request, Response } from "express";

export type DBQueryParams = string | number | boolean | undefined;

export type ControllerFunctions = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;
