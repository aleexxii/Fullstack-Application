import { Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../model/User";

export const generateToken = (res: Response, user: IUser) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });
};
