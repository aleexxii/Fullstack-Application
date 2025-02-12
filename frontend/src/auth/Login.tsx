import { useEffect } from "react";
import Lottie from "lottie-react";
import animation from "../assets/Animation - 1737728757387.json";
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../redux/store";
import toast from "react-hot-toast";
import { clearError, loginUser } from "../redux/slices/authSlice";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { user, loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const redirectTo =
        location.state?.from?.pathname ||
        (user.role === "admin" ? "/dashboard" : "/");
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = (data: LoginForm) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cyan-200">
      <div className="bg-slate-950 p-12 rounded-2xl shadow-md w-full max-w-2xl flex items-center">
        <div className="w-1/2 pr-12">
          <Lottie animationData={animation} />
        </div>
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-8 text-amber-100">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Email"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
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
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Password"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                disabled={loading}
                type="submit"
                className="bg-amber-200 hover:bg-amber-100 text-slate-900 font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

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
