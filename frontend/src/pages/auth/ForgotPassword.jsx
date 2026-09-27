import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <span className="auth-icon">
          🔑
        </span>

        <h2>Forgot Password?</h2>

        <p className="auth-subtitle">
          Password recovery is not available yet.
        </p>
      </div>

      <div className="empty-state">
        <p>
          Password reset functionality will be
          connected after the backend recovery API
          is added.
        </p>
      </div>

      <Link
        to="/login"
        className="btn btn-primary"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Back to Login
      </Link>
    </div>
  );
}

export default ForgotPassword;