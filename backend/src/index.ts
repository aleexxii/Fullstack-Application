import express from 'express'
import authRouter from './routes/authRouter'
import dotenv from 'dotenv'
dotenv.config()
import ConnectDB from './config/connectDB'
const app = express()

app.use(express.json())

const PORT = process.env.PORT || 4000
app.use('/auth',authRouter)
ConnectDB()

app.listen(PORT, () =>{
    console.log(`server running on port : ${PORT}`);
})