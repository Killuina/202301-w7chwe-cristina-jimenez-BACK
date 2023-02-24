import express from "express";
import pong from "./controllers/pong/pong.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";

export const app = express();

app.get("/", pong);

app.use("/", notFoundError);
app.use("/", generalError);
