import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";


export const PublicRoute = () => {
    const { user } = useSelector((state : RootState) => state.auth)

    if(user){
        return <Navigate to={user.role === 'admin' ? '/dashboard' : '/'} replace />;
    }
    return <Outlet />;
}

export const PrivateRoute = () => {
    const { user } = useSelector((state : RootState) => state.auth)

    if(!user){
        return <Navigate to='/login' replace />
    }
    return <Outlet />;
}
export const AdminRoute = () => {
    const { user } = useSelector((state : RootState) => state.auth)

    if(!user){
        return <Navigate to='/login' replace />
    }

    if(user.role !== 'admin'){
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export const UserRoute = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (user.role !== 'user') {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <Outlet />;
  };