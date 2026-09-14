import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(
      "Registration successful. Please login."
    );

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* LOGO */}

        <div className="register-logo">
          🎓
        </div>


        {/* HEADER */}

        <div className="register-header">

          <h1>
            Create Account
          </h1>

          <p>
            Join StudyNest and start learning
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="register-error">
            <span>!</span>

            <p>
              {error}
            </p>
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="register-success">
            <span>✓</span>

            <p>
              {success}
            </p>
          </div>
        )}


        {/* FORM */}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="register-input-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* EMAIL */}

          <div className="register-input-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="register-input-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>


          {/* ROLE */}

          <div className="register-input-group">

            <label htmlFor="role">
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="student">
                Student
              </option>

              <option value="teacher">
                Teacher
              </option>

            </select>

          </div>


          {/* BUTTON */}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

            {!loading && (
              <span>→</span>
            )}

          </button>

        </form>


        {/* LOGIN */}

        <div className="register-login">

          <p>
            Already have an account?
          </p>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;