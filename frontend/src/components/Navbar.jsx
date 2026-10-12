
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="studynest-navbar">
      {/* StudyNest Brand */}
      <Link to="/" className="studynest-logo">
        <span className="logo-icon" aria-hidden="true">
          🎓
        </span>

        <span className="logo-text">
          StudyNest
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="studynest-nav-links">
        <NavLink to="/" end className="nav-link">
          Home
        </NavLink>

        {user?.role === "student" && (
          <NavLink to="/student/dashboard" className="nav-link">
            <span className="nav-icon">▦</span>
            Dashboard
          </NavLink>
        )}

        {user?.role === "teacher" && (
          <NavLink to="/teacher/dashboard" className="nav-link">
            <span className="nav-icon">▦</span>
            Dashboard
          </NavLink>
        )}

        {!user && (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>

            <NavLink to="/register" className="nav-register">
              Register
            </NavLink>
          </>
        )}

        {user && (
          <button
            type="button"
            className="nav-logout"
            onClick={logout}
          >
            <span className="nav-icon" aria-hidden="true">↪</span>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
