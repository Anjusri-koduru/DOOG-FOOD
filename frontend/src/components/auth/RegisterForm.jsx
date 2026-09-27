import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function RegisterForm() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "participant",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

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

      {success && (
        <div className="form-success">
          {success}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="register-name">
          Full Name
        </label>

        <input
          id="register-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">
          Email
        </label>

        <input
          id="register-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-role">
          Account Type
        </label>

        <select
          id="register-role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="participant">
            Participant
          </option>

          <option value="judge">
            Judge
          </option>

          <option value="organizer">
            Organizer
          </option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="register-password">
          Password
        </label>

        <input
          id="register-password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Minimum 6 characters"
          autoComplete="new-password"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-confirm-password">
          Confirm Password
        </label>

        <input
          id="register-confirm-password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary auth-submit"
        disabled={loading}
      >
        {loading
          ? "Creating account..."
          : "Create Account"}
      </button>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;