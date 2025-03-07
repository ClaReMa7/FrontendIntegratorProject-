import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

// PrivateRoute component to protect routes based on user roles
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (roles && !roles.some((role) => hasRole(role))) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
