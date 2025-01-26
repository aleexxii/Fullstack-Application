import express from 'express'
import authRouter from './routes/authRouter'

const app = express()
const PORT = 4000

app.use(authRouter)

app.listen(PORT, () =>{
    console.log(`server running on port : ${PORT}`);
})