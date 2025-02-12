import { Request, Response } from "express";
import User from "../model/User";

export const profile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userData = JSON.parse(req.body.data);
    const { username, email } = userData;

    const profilePicture = req.file?.filename;

    const { userId } = req.params;

    const updateData: any = { username, email };

    if (profilePicture)
      updateData.profilePicture = `http://localhost:7000/backend/uploads/${profilePicture}`;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
backend -
  src -
    controller -
      userController.ts
      authController.ts
    config -
      connectDB.ts
    middleware -
      authMiddleware.ts
      uploadMiddleware.ts
    model -
      User.ts
    routes -
      authRoutes.ts
      userRoutes.ts
      adminRoutes.ts
    utils -
      generateToken.ts
    index.ts
  uploads -
frontend -
  public -
    src -
      auth -
        Login.tsx
        Register.tsx
      api -
        authApi.ts
        userApi.ts
      components -
        Navbar.tsx
        ProtectedRoute.tsx
      pages -
        admin -
          Dashboard.tsx
          Layout.tsx
          Users.tsx
        client -
          Profile.tsx
          Home.tsx
      redux -
        slices -
          authSlice.ts
          userSlice.ts
        store.ts
      App.tsx
      index.tsx
  .gitignore
  package.json
  README.md
  tsconfig.json
  yarn.lock
*/
