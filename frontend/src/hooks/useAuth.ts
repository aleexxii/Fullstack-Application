import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { login } from "../redux/slices/authSlice";
import { LoginCredentials } from "../types/auth";

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { error, isLoading, user} = useSelector((state : RootState) => state.auth)

    const handleLogin = async (credentials : LoginCredentials) => {
        try{
            console.log('credentials >>', credentials);
            await dispatch(login(credentials)).unwrap()
            return true
        }catch (error){
            console.log(error);
            return false
        }
    }

    return {
        user,
        isLoading,
        error,
        login : handleLogin
    }
}