import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../model/User";

export const profile = async (req: Request, res: Response) => {
  try {
    console.log('reached');
    console.log(' Request > ', req);
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const profilePicture = req.file?.filename

    if (!name && !email) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    const updateFields: Partial<{
      username: string;
      email: string;
      profilePicture: string;
    }> = {};

    if (name) updateFields.username = name;
    if (email) updateFields.email = email;
    if (profilePicture) updateFields.profilePicture = profilePicture.replace(/\\/g, "/");

    const user = await User.findByIdAndUpdate(req.user?.userId, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.save();
    res.json({
      success: true,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture, // Return updated image path
  });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
