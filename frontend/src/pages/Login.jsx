import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const result = await login(
      email,
      password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.user.role === "student") {
      navigate("/student/dashboard");
    } else if (result.user.role === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* LOGO */}

        <div className="login-logo">
          🎓
        </div>


        {/* HEADER */}

        <div className="login-header">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to continue to StudyNest
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="login-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}


        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="login-input-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="login-input-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}

            {!loading && (
              <span>→</span>
            )}
          </button>

        </form>


        {/* REGISTER */}

        <div className="login-register">

          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create an account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;