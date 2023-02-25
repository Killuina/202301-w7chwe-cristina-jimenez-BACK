import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import User from "../../../database/models/User.js";
import { type UserStructure } from "../../types";
import { CustomError } from "../../../CustomError/CustomError.js";

const saltLength = 10;

export const registerUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserStructure>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, username, email } = req.body;

    const avatar = req.file!.originalname;

    const hashedPassword = await bcrypt.hash(password, saltLength);

    await User.create({ avatar, password: hashedPassword, username, email });

    res.status(201).json({
      message: `User '${username}' with email ${email} created!`,
      username,
      email,
    });
  } catch (error: unknown) {
    const registerUserError = new CustomError(
      (error as Error).message,
      409,
      "There was a problem creating the user"
    );

    next(registerUserError);
  }
};
