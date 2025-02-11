import mongoose, { Document, Schema } from "mongoose";
import bcryptJs from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  profilePicture : string;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role : {
    type : String,
    enum : ['admin', 'user'],
    default : 'user'
  },
  profilePicture : {
    type : String,
    default : "https://th.bing.com/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?rs=1&pid=ImgDetMain"
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcryptJs.genSalt(10);
  this.password = await bcryptJs.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcryptJs.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
