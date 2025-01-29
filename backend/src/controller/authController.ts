import { Request, Response } from "express";
import User from "../model/User";
import { clearToken, generateToken } from "../utils/generateToken";

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

    const token = generateToken(user);

    const userObj = user.toObject();
    const { password: hashedPassword, ...rest } = userObj;

    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite : 'strict'
    });

    return res.status(200).json({ token, user: rest });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "User logged out" });
};

export { registerUser, login, logout };
