import { Request, Response } from "express";
import User from "../model/User";
import { clearToken, generateToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";

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
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "15m" }
    );
    const userObj = user.toObject();
    const { password: hashedPassword, ...rest } = userObj;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    return res.status(200).json({ token: accessToken, user: rest });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const refresh = (req: Request, res: Response) => {
  
  const { refreshToken } = req.cookies;
console.log('refresh token in refresh controller  ', refreshToken);

  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!,
    (err: any, decoded: any) => {
      console.log('decoded from controller  ', decoded);
      if (err || !decoded.id) {
        return res.status(403).json({ message: "Invalid Refresh Token" });
      }
      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );

      res.json({ token: newAccessToken });
    }
  );
};

const logout = (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "User logged out" });
};


export { registerUser, login, logout, refresh };
