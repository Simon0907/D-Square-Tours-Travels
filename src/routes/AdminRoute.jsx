import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("adminAuth");
  return isAdmin ? children : <Navigate to="/auth" />;
};

export default AdminRoute;
