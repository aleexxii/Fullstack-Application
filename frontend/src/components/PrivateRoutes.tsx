import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


interface PrivateRouteProps {
    children : React.ReactNode;
    roles? : Array<'admin' | 'user'>
}

export const PrivateRoutes : React.FC<PrivateRouteProps> = ({children, roles}) => {
    const { user, isLoading} = useAuth()
    const location = useLocation()

    if(isLoading){
        return <div>Loading...</div>
    }

    if(!user){
        return <Navigate to='/login' state={{from : location}} replace />
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
      }
    
      return <>{children}</>;
}