import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../model/User";

export const profile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log('reached');
    const { name, email } = req.body;
    console.log(name, email);
    if (!name && !email) {
        return res.status(400).json({ message: "Nothing to update" });
    }
    const updateFields: Partial<{ name: string; email: string }> = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    const existUser = await User.findById(req.user?.userId)

    console.log('existUser > ', existUser);

    const user = await User.findByIdAndUpdate(req.user?.userId, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
