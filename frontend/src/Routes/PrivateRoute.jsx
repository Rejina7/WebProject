import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  try {
    const user = localStorage.getItem("user");
    return Boolean(user);
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children, requiredRole = null }) => {
  if (!isAuthenticated()) {
    console.log("❌ PrivateRoute: User not authenticated");
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole) {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      console.log("🔍 PrivateRoute: Checking role. Required:", requiredRole, "User role:", user?.role, "User data:", user);
      if (!user || user.role !== requiredRole) {
        console.log("❌ PrivateRoute: Role check failed. Redirecting to /dashboard");
        return <Navigate to="/dashboard" replace />;
      }
    } catch (e) {
      console.error("❌ PrivateRoute: Error parsing user:", e);
      return <Navigate to="/login" replace />;
    }
  }

  console.log("✅ PrivateRoute: Auth passed, rendering children");
  return children;
};

export default PrivateRoute;