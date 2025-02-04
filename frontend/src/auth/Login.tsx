import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animation from "../assets/Animation - 1737728757387.json";
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, error} = useSelector((state : RootState) => state.auth)
  

  useEffect(() => {
    if(user){
      if(user.role == 'user'){
        navigate('/',{ replace: true })
      }else if(user.role == 'admin'){
        navigate('/dashboard', { replace: true })
      }
    }
  },[user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({email,password}))
  };


  return (
    <div className="flex justify-center items-center h-screen bg-cyan-200">
      <div className="bg-slate-950 p-12 rounded-2xl shadow-md w-full max-w-2xl flex items-center">
        <div className="w-1/2 pr-12">
          <Lottie animationData={animation} />
        </div>
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-8 text-amber-100">Login</h2>
          <form onSubmit={handleSubmit}>
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
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Loading..." : 'Login'}
              </button>
            </div>

            {error && <p className="flex justify-center pt-2 text-sm text-red-500">{error}</p>}

            <div className="flex flex-col justify-center items-center mt-4">
              <p className="text-white">OR</p>
              <button className="text-white mt-3">Sign In with Google</button>
              <p className="mt-3 text-white text-sm">
                Dont have an account?
                <Link to="/register">
                  <span className="text-blue-500"> Sign Up</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
