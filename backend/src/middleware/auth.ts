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
    console.log("token form middleware:", token);

    if (!token) {
      throw new Error("No token found");
    }
console.log('before decoded');
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET! as string
    ) as TokenPayload & { id?: string };

    console.log("decoded :>>", decoded);

    const user = await User.findById(decoded.id).select("-password");
    console.log("user from auth middleware :>> ", user);
    
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

