import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RoleRoute({
  children,
  allowedRoles = [],
}) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  /* =========================
     AUTH CHECK
  ========================= */

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /* =========================
     ROLE CHECK
  ========================= */

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /* =========================
     AUTHORIZED
  ========================= */

  return children;
}

export default RoleRoute;