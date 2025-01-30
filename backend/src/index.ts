import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import ConnectDB from "./config/connectDB";
import authRouter from "./routes/authRouter";
import adminRouter from "./routes/adminRoutes";
import userRoutes from "./routes/userRoute";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 4000;
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/user", userRoutes);
ConnectDB();

app.listen(PORT, () => {
  console.log(`server running on port : ${PORT}`);
});
