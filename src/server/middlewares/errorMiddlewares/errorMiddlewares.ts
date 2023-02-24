import { type NextFunction, type Request, type Response } from "express";
import createDebug from "debug";
import { type CustomError } from "../../../customError/customError.js";

export const debug = createDebug("feisbuk:errors");

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(error.message);

  res
    .status(error.statusCode || 500)
    .json({ error: error.publicMessage || "Something went wrong :(" });
};
