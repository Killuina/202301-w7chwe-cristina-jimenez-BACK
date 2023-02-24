import { type Request, type NextFunction, type Response } from "express";
import { CustomError } from "../../../customError/customError";
import { generalError } from "./errorMiddlewares.js";

describe("Given a generalError middleware", () => {
  describe("When it receives a response and an error with status 500", () => {
    test("Then it should call its status method with 500", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const req = {} as Request;
      const next = () => ({} as NextFunction);
      const statusCode = 500;
      const error = new CustomError("Error", statusCode, "Error");

      generalError(error, req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call its json method with property error: 'Error'", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const req = {} as Request;
      const next = () => ({} as NextFunction);
      const statusCode = 500;
      const error = new CustomError("Error", statusCode, "Error");

      generalError(error, req, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ error: error.publicMessage });
    });
  });
});
