import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function LoginForm() {
  const navigate = useNavigate();

  const {
    login,
    loading: authLoading,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login(
        formData.email.trim(),
        formData.password
      );

      const user =
        response?.data?.user ||
        response?.user;

      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "organizer") {
        navigate("/organizer/dashboard");
      } else if (user?.role === "judge") {
        navigate("/judge/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting =
    loading || authLoading;

  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">
          Email
        </label>

        <input
          id="login-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">
          Password
        </label>

        <input
          id="login-password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-options">
        <Link
          to="/forgot-password"
          className="forgot-link"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="btn btn-primary auth-submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Logging in..."
          : "Login"}
      </button>

      <p className="auth-switch">
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;