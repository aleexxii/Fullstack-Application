import express from "express";
import { registerUser, login, logout } from "../controller/authController";
const router = express.Router();
import { verifyToken } from "../middleware/auth";
import User from "../model/User";
import jwt, { JwtPayload } from "jsonwebtoken";
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
