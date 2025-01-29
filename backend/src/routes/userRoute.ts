import express from 'express'
import { verifyToken } from '../middleware/auth'
import { profile, updateProfile } from '../controller/userController'
const router = express.Router()

router.get('/profile', verifyToken,profile)
router.put('/update-profile', verifyToken,updateProfile)

export default router