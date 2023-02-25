import { type Response, type NextFunction, type Request } from "express";
import User from "../../../database/models/User";
import { type UserStructure } from "../../types";
import { registerUser } from "./usersControllers";

describe("Given the createUser controller", () => {
  const user: UserStructure = {
    username: "hola",
    password: "12345678",
    email: "hola@h.com",
  };

  describe("When it receives a request with username: 'hola', password: '12345678 and email: 'hola@h.com'", () => {
    test("Then it should call the status method with 201", async () => {
      const req = {
        body: user,
        file: {
          originalname: "hola.jpg",
        },
      } as Request<
        Record<string, unknown>,
        Record<string, unknown>,
        UserStructure
      >;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next: NextFunction = () => ({});
      const expectedStatusCode = 201;

      User.create = jest.fn();

      await registerUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its json method with object containing message: 'User 'hola' with email:hola@h.com created!'", async () => {
      const req = {
        body: user,
        file: {
          originalname: "hola.jpg",
        },
      } as Request<
        Record<string, unknown>,
        Record<string, unknown>,
        UserStructure
      >;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next: NextFunction = () => ({});
      User.create = jest.fn();

      await registerUser(req, res as Response, next);

      expect(res.json).toBeCalledWith({
        message: `User '${user.username}' with email ${user.email} created!`,
        username: user.username,
        email: user.email,
      });
    });
  });
});
