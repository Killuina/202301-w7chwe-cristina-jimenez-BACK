import express from "express";
import morgan from "morgan";
import cors from "cors";
import pong from "./controllers/pong/pong.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import usersRouter from "./routers/usersRouter.js";

export const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

app.use("/", notFoundError);
app.use("/", generalError);

app.get("/", pong);
