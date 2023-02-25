import { Router } from "express";

const registerEndpoint = "/register";

const usersRouter = Router();

usersRouter.post(registerEndpoint);
