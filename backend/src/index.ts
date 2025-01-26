import express from 'express'
import authRouter from './routes/authRouter'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(authRouter)

app.listen(PORT, () =>{
    console.log(`server running on port : ${PORT}`);
})