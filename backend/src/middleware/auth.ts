import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new Error("No token found");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET! as string
    ) as TokenPayload & { id?: string };

    const user = await User.findById(decoded.id).select("-password");

    req.user = {
      userId: decoded.id || "",
      email: decoded.email ?? "",
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid acces token" });
  }
};
