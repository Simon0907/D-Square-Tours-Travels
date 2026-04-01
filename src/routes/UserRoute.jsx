import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");

  // Allow if token exists and user is logged in
  if (token && user?._id) {
    return children;
  }

  // Not logged in — redirect to auth
  return <Navigate to="/auth" replace />;
};

export default UserRoute;