import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { login, logout, checkAuth } from "../redux/slices/authSlice";
import { LoginCredentials } from "../types/auth";

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { error, isLoading, user} = useSelector((state : RootState) => state.auth)

    const handleLogin = async (credentials : LoginCredentials) => {
        try{
            await dispatch(login(credentials)).unwrap()
            return true
        }catch (error){
            console.log(error);
            return false
        }
    }

    const handleLogout = () => {
        dispatch(logout());
      };
    
      const handleCheckAuth = () => {
        dispatch(checkAuth());
      };

    return {
        user,
        isLoading,
        error,
        login : handleLogin,
        logout: handleLogout,
        checkAuth: handleCheckAuth
    }
}