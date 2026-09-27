import {
  Navigate,
} from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";

function Login() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <Loader text="Loading..." />
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <span className="auth-icon">
          🔐
        </span>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to your DOGFOOD account.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}

export default Login;