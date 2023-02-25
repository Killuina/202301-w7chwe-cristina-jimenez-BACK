import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../controllers/usersControllers/usersControllers.js";
import multerMiddleware from "../middlewares/multerMiddleware.js";

const registerEndpoint = "/register";
const loginEndpoit = "/login";

const usersRouter = Router();

usersRouter.post(registerEndpoint, multerMiddleware, registerUser);
usersRouter.post(loginEndpoit, loginUser);

export default usersRouter;
