import { Router } from "express";
import { registerUser } from "../controllers/usersControllers/usersControllers.js";
import multerMiddleware from "../middlewares/multerMiddleware.js";

const registerEndpoint = "/register";

const usersRouter = Router();

usersRouter.post(registerEndpoint, multerMiddleware, registerUser);

export default usersRouter;
