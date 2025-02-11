import express from "express";
import { registerUser, login, logout, refresh, fetchMe } from "../controller/authController";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refresh);

router.get("/me", verifyToken, fetchMe);

export default router;
