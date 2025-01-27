import express from "express";
import { registerUser, login, logout } from "../controller/authController";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);

export default router;
