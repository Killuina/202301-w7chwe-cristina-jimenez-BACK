import mongoose from "mongoose";
import connectDatabase from "../../database/connectDatabase";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { app } from "..";
import { type UserStructure } from "../types";
import User from "../../database/models/User";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});
describe("Given the POST /users/login endpoint", () => {
  const userData = {
    username: "notDiana",
    password: "12345678",
    email: "not@diana.com",
  };
  beforeAll(async () => {
    await User.create(userData);
  });

  describe("When it receives a request with a user with username 'notDiana' and password '12345678' and the user exists", () => {
    test("Then it should respond with status 200 and property token with value 'mocken'", async () => {
      const expectedStatus = 200;
      const expectedToken = "mocken";
      const path = "/users/login";
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);

      const response = await request(app)
        .post(path)
        .send(userData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token", expectedToken);
    });
  });
  describe("When it receives a request with a user with username 'notDiana' and password '12345678' and the user doesn't exists", () => {
    test("Then it should respond with status 401 and error: 'Wrong Credentials'", async () => {
      const expectedStatus = 401;
      const expectedMessage = "Wrong credentials";
      const path = "/users/login";

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const response = await request(app)
        .post(path)
        .send(userData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});

describe("Given the POST /users/register endpoint", () => {
  const userData: UserStructure = {
    username: "Manolo",
    password: "queesunafuncionpura",
    email: "manolo@manolo.com",
  };
  const expectedResponseBody = {
    message: `User '${userData.username}' with email ${userData.email} created!`,
    username: userData.username,
    email: userData.email,
  };

  describe("when it receives a request with a user with username 'Manolo', password 'queesunafuncionpura' and a file 'manolo.jpg'", () => {
    test("Then it should respond with status 201 and an object with message, username and email", async () => {
      const expectedStatus = 201;
      const userData: UserStructure = {
        username: "Manolo",
        password: "queesunafuncionpura",
        email: "manolo@manolo.com",
      };

      const response = await request(app)
        .post("/users/register")
        .field("username", userData.username)
        .field("password", userData.password)
        .field("email", userData.email)
        .attach("avatar", "testMedia/1677238314361favicon.ico.jpg")
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });
});
