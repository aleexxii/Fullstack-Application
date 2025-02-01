import { FaUserShield } from "react-icons/fa";
import signup_animation from "../assets/signup-Animation.json";
import { useState } from "react";
import Lottie from "lottie-react";
import { BsFillShieldLockFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { register } from "../redux/slices/authSlice";


const Register = () => {
const navigate = useNavigate()
const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!name || !email || !password){
      toast.error("Please fill in all fields")
      return
    }

    try{
      const result = await dispatch(register(formData)).unwrap()

      toast.success("Registration successful!")
console.log(result);
      setTimeout(() => {
        navigate('/login')
      },1500)
    }catch (error){
      if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }

  };


  return (
    <div className="flex justify-center items-center h-screen bg-cyan-200">
      <div className="bg-slate-950 p-12 rounded-2xl shadow-md w-full max-w-2xl flex items-center">
        <div className="w-1/2 pr-12">
          <Lottie animationData={signup_animation} />
        </div>
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-8 text-amber-100">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-amber-100 font-bold mb-2"
              >
                Username
              </label>
              <div className="relative">
                <FaUserShield className="absolute top-3 left-3 text-amber-100" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Name"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-amber-100 font-bold mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <FaUserShield className="absolute top-3 left-3 text-amber-100" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Email"
                />
              </div>
            </div>
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-amber-100 font-bold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <BsFillShieldLockFill className="absolute top-3 left-3 text-amber-100" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Password"
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-amber-200 hover:bg-amber-100 text-slate-900 font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                SignUp
              </button>
            </div>
            <div className="pt-4">
              <p className="text-white text-sm">
                Already have an account?
                <Link to="/login">
                  <span className="text-blue-500"> Log in</span>
                </Link>
              </p>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Register;
