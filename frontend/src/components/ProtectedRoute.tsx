import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";


interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'user')[];
}

const ProtectedRoute = ({allowedRoles} : ProtectedRouteProps) => {
  const { user } = useSelector((state : RootState) => state.auth);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.roles as 'admin' | 'user')) {
    return <Navigate to="/forbidden" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;