import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState, useAppDispatch } from "../redux/store";
import { useEffect } from "react";
import { fetchCurrentUser } from "../redux/slices/authSlice";


const ProtectedRoute = ({ role } : {role?: string[]}) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  console.log("user from protected route", user);
  const dispatch = useAppDispatch();



  useEffect(() => {
    if(!user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user, loading]);

  if(loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  if (role && !role.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
