import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  // Check both localStorage and Redux state for more reliable authentication
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Also check Redux state (optional, for consistency)
  const reduxToken = useSelector((state) => state.auth.token);
  const reduxUserRole = useSelector((state) => state.auth.role);

  // Consider authenticated if token exists and user has admin role
  const isAuthenticated = token && (role === "admin" || role === "super-admin");

  // console.log("PrivateRoute check:", {
  //   token: !!token,
  //   role,
  //   isAuthenticated,
  //   reduxToken: !!reduxToken,
  //   reduxUserRole,
  // });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
