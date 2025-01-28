import express from "express";
import { registerUser, login, logout } from "../controller/authController";
const router = express.Router();
import { verifyToken } from "../middleware/auth";
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);

router.get('/api/auth/me', verifyToken, (req, res) => {
    // authenticateToken middleware verifies the JWT/session
    res.json({ 
      user: req.user // Returns current user data
    });
  });

export default router;
