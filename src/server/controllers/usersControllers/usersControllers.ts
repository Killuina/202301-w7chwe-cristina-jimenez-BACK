import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User.js";
import { type UserLoginCredentials, type UserStructure } from "../../types";
import { CustomError } from "../../../CustomError/CustomError.js";
import { type CustomJwtPayload } from "../types.js";

const saltLength = 10;

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserLoginCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, username } = req.body;
    const user = await User.findOne({ username }).exec();

    if (!user) {
      const userError = new CustomError(
        "Wrong username",
        401,
        "Wrong credentials"
      );

      next(userError);

      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const userError = new CustomError(
        "Wrong password",
        401,
        "Wrong credentials"
      );

      next(userError);

      return;
    }

    const jwtPayload: CustomJwtPayload = {
      sub: user?._id.toString(),
      username,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next((error as Error).message);
  }
};

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
