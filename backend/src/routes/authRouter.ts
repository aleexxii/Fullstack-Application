import express from "express";
import { registerUser, login, logout, refresh } from "../controller/authController";
const router = express.Router();
import User from "../model/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../middleware/auth";
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refresh);

router.get("/me", verifyToken,async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log('token form me ', token);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
