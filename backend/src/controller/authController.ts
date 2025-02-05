import { Request, Response } from "express";
import User from "../model/User";
import {
  clearToken,
  generateRefreshToken,
  generateToken,
} from "../utils/generateToken";
import jwt, { JwtPayload } from "jsonwebtoken";

const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User is already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      role,
    });
    await user.save();
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const passwordMatch = await user?.comparePassword(password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    const userObj = user.toObject();
    const { password: hashedPassword, ...rest } = userObj;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 min
    });

    return res.status(200).json({ token: accessToken, user: rest });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const refresh = (req: Request, res: Response) => {

  const { refreshToken } = req.cookies;
  console.log(" refreshToken from refresh controller > ", refreshToken);
console.log(req.cookies);
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!,
    (err: any, decoded: any) => {
      if (err || !decoded.id) {
        return res.status(403).json({ message: "Invalid Refresh Token" });
      }
      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" } // New refresh token expiry
      );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "none",
      });

      res.json({ token: newAccessToken });
    }
  );
};

export const fetchMe = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token form me ", token);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const logout = (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "User logged out" });
};

export { registerUser, login, logout, refresh };
