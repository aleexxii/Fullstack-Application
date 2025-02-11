import jwt from "jsonwebtoken";
import { IUser } from "../model/User";
import { Response } from "express";

export const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user : IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "1h",
  });
}

export const clearToken = (res: Response) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
