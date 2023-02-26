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

const corsOptions = {
  origin: [
    "https://202301-w7chwe-cristina-jimenez.netlify.app/",
    "http://localhost:300st:3000",
  ],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

app.use("/", notFoundError);
app.use("/", generalError);

app.get("/", pong);
