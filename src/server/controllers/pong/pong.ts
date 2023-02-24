import { type Request, type Response } from "express";

const pong = (req: Request, res: Response) => {
  res.status(200).json({ pong: "We're working on this API, come back later!" });
};

export default pong;
