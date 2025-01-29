import { Request, Response, NextFunction } from "express";
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

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken =
      req.cookies.accessToken ?? req.headers["authorization"]?.split(" ")[1];

    if (!accessToken) {
      return res.status(403).json({ message: "No acces token" });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET! as string
    ) as TokenPayload & { id?: string };

    req.user = {
      userId: decoded.userId || decoded.id!,
      email: decoded.email ?? "",
      role: decoded.role,
    };
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
