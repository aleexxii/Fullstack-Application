import express from 'express'
import { verifyToken } from '../middleware/auth'
import { profile, updateProfile } from '../controller/userController'
import upload from '../middleware/upload'
const router = express.Router()

router.get('/profile/:userId',verifyToken,profile)
router.put('/update-profile/:userId', verifyToken,upload.single('profilePicture'),updateProfile)

export default router