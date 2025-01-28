import jwt from "jsonwebtoken";
import { IUser } from "../model/User";
import { Response } from "express";

export const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

// export const genereateRefreshToken = (user : IUser) => {
//   return jwt.sign(user, process.env.JWT_REFRESH_SECRET!, {expiresIn : '7d'})
// }

export const clearToken = (res: Response) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
