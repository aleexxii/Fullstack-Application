import { FaUserShield } from "react-icons/fa";
import signup_animation from "../assets/signup-Animation.json";
import Lottie from "lottie-react";
import { useForm } from "react-hook-form";
import { BsFillShieldLockFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { clearError, registerUser } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";



interface RegisterFrom{
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { register, handleSubmit, formState : {errors }, watch } = useForm<RegisterFrom>();
  const dispatch = useAppDispatch();
  const { success, loading, error } = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if(success){
      toast.success('Registration successful. Please login');
      navigate('/login');
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);


  const onSubmit = async (data : RegisterFrom) => {
    dispatch(registerUser({username: data.username, email: data.email, password: data.password}));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cyan-200">
      <div className="bg-slate-950 p-12 rounded-2xl shadow-md w-full max-w-2xl flex items-center">
        <div className="w-1/2 pr-12">
          <Lottie animationData={signup_animation} />
        </div>
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-8 text-amber-100">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register('username', { required: 'Name is required' })}
                  className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Name"
                />
                {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
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
                  {...register('email', { required: 'Name is required',pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  }, })}
                  className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Email"
                />
                {errors.email && <span className="text-red-500 text-sm">{error}</span>}
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
                  {...register('password', { required: 'Name is required',minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  }, })}
                  className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your Password"
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>

              <div>
        <label>Confirm Password</label>
        <input
          type="password"
          className="shadow appearance-none text-gray-300 bg-slate-800 border rounded w-full py-3 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline"
          {...register('confirmPassword', {
            validate: (value) =>
              value === watch('password') || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
      </div>

            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-amber-200 hover:bg-amber-100 text-slate-900 font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Loading...' : 'Register'}
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
