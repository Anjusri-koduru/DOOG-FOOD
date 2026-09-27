import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="auth-logo">🐶</div>

        <h1>DOGFOOD</h1>

        <p>
          Hackathon Management & Judging Platform
        </p>
      </div>

      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;