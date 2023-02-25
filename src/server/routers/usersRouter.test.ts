import mongoose from "mongoose";
import connectDatabase from "../../database/connectDatabase";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "..";
import { type UserStructure } from "../types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
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
