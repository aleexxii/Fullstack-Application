import express from 'express'
import { verifyToken } from '../middleware/auth'
import { profile, updateProfile } from '../controller/userController'
import upload from '../middleware/upload'
const router = express.Router()

router.get('/profile',verifyToken,profile)
router.put('/update-profile', verifyToken,upload.single('profilePicture'),updateProfile)

export default router