import { Request, Response } from "express";
import User from "../model/User";
import { generateToken } from "../utils/generateToken";


const registerUser = async (req: Request, res: Response) : Promise<Response> => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if(existingUser){
        return res.status(400).json({message : 'User is already exists'})
    }

    const user = new User({
        name,
        email,
        password
    })
    await user.save()
    return res.status(200).json({message : 'User registered successfully'})
  } catch (error) {
    return res.status(500).json({message : 'Internal server error'})
  }
};

const login = async (req: Request, res: Response) : Promise<Response> => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message : 'User not found'})
        }

        const passwordMatch = await user?.comparePassword(password)
        console.log('passwordMatch :' , passwordMatch);

        if(!passwordMatch){
            return res.status(400).json({message : 'Incorrect password'})
        }
        
        const token = generateToken(user)

        return res.status(200).json({token})

    } catch (error) {
        return res.status(500).json({message : 'Internal server error'})
    }
};

const logout = (req: Request, res: Response) => {};

export { registerUser, login, logout };
