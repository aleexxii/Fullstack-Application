import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState, useAppDispatch } from "../redux/store";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../redux/slices/authSlice";


const ProtectedRoute = ({ role } : {role?: string[]}) => {

  const { user, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation()
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if(!user && !loading) {
      dispatch(fetchCurrentUser()).finally(() => setCheckingAuth(false));
    }else{
      setCheckingAuth(false);
    }
  }, [dispatch, user, loading]);

  if(loading || checkingAuth) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Navigate to="/login" state={{from : location}} replace/>;
  }

  if (role && !role.includes(user.role)) {
    // prevent user from accessing admin page or prevent admin from accessing user page
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/"} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
