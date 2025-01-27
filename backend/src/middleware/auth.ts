import { Request, Response, NextFunction } from "express";
import { Express } from "express-serve-static-core";
import jwt from "jsonwebtoken";

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
  userId: string;
  email: string;
  role: string;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.jwt;
    console.log("acces token >>", accessToken);

    if (!accessToken) {
      return res.status(403).json({ message: "No acces token" });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET! as string
    ) as TokenPayload;
    console.log("decoded >> ", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid acces token" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Requires admin access" });
  }
  next();
};
