import { type Request, type NextFunction, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import { generalError, notFoundError } from "./errorMiddlewares";

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

describe("Given the notFoundError middlware", () => {
  describe("When it receives a request", () => {
    test("Then it should call the received next function", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const req = {} as Request;
      const next = jest.fn();

      notFoundError(req, res as Response, next);

      expect(next).toBeCalled();
    });
  });
});
