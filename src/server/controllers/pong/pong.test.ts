import { type Request, type Response } from "express";
import pong from "./pong";

describe("Given the pong controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its status method with 200", () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const req = {} as Request;
      const expectedStatusCode = 200;

      pong(req, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });
});
