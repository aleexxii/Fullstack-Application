import express from "express";
import { registerUser, login, logout, refresh, getCurrentUser } from "../controller/authController";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refresh);

router.get("/user",verifyToken, getCurrentUser);

export default router;
