import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("token");
    return Boolean(token);
  } catch {
    return false;
  }
};

const PrivateRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;