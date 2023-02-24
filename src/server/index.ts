import express from "express";
import pong from "./controllers/pong/pong.js";

export const app = express();

app.get("/", pong);
