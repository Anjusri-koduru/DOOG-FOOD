import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import "../../styles/register.css";

function Register() {
  const { register } = useAuth();

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "participant",
      college: "",
      bio: "",
      skills: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    // ------------------------------
    // BASIC VALIDATION
    // ------------------------------

    if (!form.name.trim()) {
      setError(
        "Full name is required"
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Email is required"
      );
      return;
    }

    if (!form.password) {
      setError(
        "Password is required"
      );
      return;
    }

    if (
      form.password.length < 8
    ) {
      setError(
        "Password must contain at least 8 characters"
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      // ------------------------------
      // PREPARE DATA
      // ------------------------------

      const registrationData = {
        name: form.name.trim(),
        email: form.email
          .trim()
          .toLowerCase(),

        password:
          form.password,

        // IMPORTANT:
        // selected role is sent
        // to backend.
        role: form.role,

        college:
          form.college.trim(),

        bio:
          form.bio.trim(),

        skills: form.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean),
      };

      // ------------------------------
      // REGISTER
      // ------------------------------

      const response =
        await register(
          registrationData
        );

      if (
        response?.success
      ) {
        navigate(
          "/login",
          {
            replace: true,
            state: {
              message:
                "Registration successful. Please login.",
            },
          }
        );
      } else {
        setError(
          response?.message ||
            "Registration failed"
        );
      }
    } catch (err) {
      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="auth-logo">
          🐶
        </div>

        <h1>
          Create Account
        </h1>

        <p className="auth-subtitle">
          Join the DOGFOOD hackathon
          platform.
        </p>

        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {/* ========================= */}
        {/* FORM */}
        {/* ========================= */}

        <form
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}

          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={
                handleChange
              }
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={
                handleChange
              }
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          {/* ROLE */}

          <div className="form-group">
            <label htmlFor="role">
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={
                handleChange
              }
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

          {/* COLLEGE */}

          <div className="form-group">
            <label htmlFor="college">
              College
            </label>

            <input
              id="college"
              name="college"
              type="text"
              value={
                form.college
              }
              onChange={
                handleChange
              }
              placeholder="Enter your college"
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="Minimum 8 characters"
              disabled={loading}
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={
                form.confirmPassword
              }
              onChange={
                handleChange
              }
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          {/* BIO */}

          <div className="form-group">
            <label htmlFor="bio">
              Bio
              <span className="optional">
                Optional
              </span>
            </label>

            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={
                handleChange
              }
              placeholder="Tell us about yourself"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* SKILLS */}

          <div className="form-group">
            <label htmlFor="skills">
              Skills
              <span className="optional">
                Optional
              </span>
            </label>

            <input
              id="skills"
              name="skills"
              type="text"
              value={
                form.skills
              }
              onChange={
                handleChange
              }
              placeholder="React, Python, AI"
              disabled={loading}
            />
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* ========================= */}
        {/* LOGIN */}
        {/* ========================= */}

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;