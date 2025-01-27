import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth";
const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  return res.status(200).json({ message: "welcome to admin dashboard" });
});

export default router;
