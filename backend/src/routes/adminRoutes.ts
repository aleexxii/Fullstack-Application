import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth";
import User from "../model/User";
const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  return res.status(200).json({ message: "welcome to admin dashboard" });
});

router.get('/users-list', async (req,res) => {
  try{
    const users = await User.find()
    res.json(users)
  }catch(err){
    console.log(err);
  }
})

router.post('/create-user', async (req,res) => {
  try{
    const { name, email, password, profilePicture, role} = req.body
    console.log('req body : ', req.body);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User is already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      role,
    });
    await user.save();
    return res.status(200).json({ message: "User registered successfully" });
  }catch(error){
    console.log(error);
  }
})

router.put('/update', async(req,res)=>{
  try {
    const { id, name, email } = req.body

    const user = await User.updateOne({_id : id}, {name,email})

    if(!user){
      return res.status(401).json({message : 'User not found!'})
    }

    return res.status(200).json({message : 'Update successfully'})
  } catch (error) {
    console.log(error);
  }
})


router.delete('/delete/:userId', async (req, res)=>{
  try {
    const {userId} = req.params
    console.log(userId);

    const data = await User.deleteOne({_id : userId})

    return res.status(200).json({message : 'Deleted successfully'})

  } catch (error) {
    console.log(error);
  }
})
export default router;
