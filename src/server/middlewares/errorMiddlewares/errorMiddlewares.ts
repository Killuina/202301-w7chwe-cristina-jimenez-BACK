import { type NextFunction, type Request, type Response } from "express";
import createDebug from "debug";
import { CustomError } from "../../../CustomError/CustomError.js";

export const debug = createDebug("feisbuk:server:middlewares:errorMiddleware");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const notFoundError = new CustomError(
    "Wrong endpoint",
    404,
    "Endpoint not found"
  );

  next(notFoundError);
};

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
