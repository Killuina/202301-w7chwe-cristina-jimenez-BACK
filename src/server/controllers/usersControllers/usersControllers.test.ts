import { type Response, type NextFunction, type Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User";
import { type UserLoginCredentials, type UserStructure } from "../../types";
import { loginUser, registerUser } from "./usersControllers";
import { CustomError } from "../../../CustomError/CustomError";
import mongoose from "mongoose";

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;
const req = {} as Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserLoginCredentials
>;
const next = jest.fn() as NextFunction;

beforeEach(() => jest.clearAllMocks());

describe("Given a loginUser controller", () => {
  const mockUser: UserLoginCredentials = {
    username: "rasputin",
    password: "rasputin11",
  };

  describe("When it receives a request with a username 'rasputin' and password 'rasputin11' and the user is not registered in the database", () => {
    test("Then it should call its next method with a status 401 and the messages 'Wrong username' and 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "Wrong username",
        401,
        "Wrong credentials"
      );
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a username 'rasputin' and password 'rasputin11' and the user is registered in the database but the passwords don't match", () => {
    test("Then it should call its next method with a status 401 and the messages 'Wrong password' and 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "Wrong password",
        401,
        "Wrong credentials"
      );
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a username `rasputin` and password `rasputin11` and the user is registered in the database", () => {
    const expectedToken = "mocken";
    const expectedResponseBody = { token: expectedToken };

    test("Then it should call its status method with 200", async () => {
      const expectedStatusCode = 200;
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);

      await loginUser(req, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its json method with a token", async () => {
      req.body = mockUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);

      await loginUser(req, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });
});

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
      const expectedResponseObject = {
        message: `User '${user.username}' with email ${user.email} created!`,
        username: user.username,
        email: user.email,
      };

      await registerUser(req, res as Response, next);

      expect(res.json).toBeCalledWith(expectedResponseObject);
    });
  });
});
