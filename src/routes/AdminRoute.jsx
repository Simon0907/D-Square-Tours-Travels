import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token     = localStorage.getItem("token");
  const adminAuth = localStorage.getItem("adminAuth");
  const user      = JSON.parse(localStorage.getItem("user") || "{}");

  // Allow if token exists AND adminAuth is set AND role is admin
  if (token && adminAuth === "true" && user?.role === "admin") {
    return children;
  }

  // Not admin — redirect to auth
  return <Navigate to="/auth" replace />;
};

export default AdminRoute;