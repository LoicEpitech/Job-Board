// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.type)) {
    return <Navigate to="/forbidden" />;
  }
  //route si page n'existe pas 404
  return <Navigate to="/404" />;
  return children;
}

export default PrivateRoute;
