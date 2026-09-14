import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {

  const { user } = useAuth();


  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // User has the wrong role
  if (
    role &&
    user.role !== role
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  // Authorized user
  return children;
}

export default ProtectedRoute;