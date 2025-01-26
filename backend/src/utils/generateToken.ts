import jwt from 'jsonwebtoken'
import { IUser } from '../model/User'

export const generateToken = (user : IUser) =>{
    return jwt.sign({id : user._id, role : user.role}, process.env.JWT_SECRET!, {expiresIn : '1d'})
}