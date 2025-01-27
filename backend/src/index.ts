import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import ConnectDB from "./config/connectDB";
import authRouter from "./routes/authRouter";
import adminRouter from "./routes/adminRoutes";


const app = express();
app.use(cookieParser());

app.use(express.json());

const PORT = process.env.PORT || 4000;
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
ConnectDB();

app.listen(PORT, () => {
  console.log(`server running on port : ${PORT}`);
});
