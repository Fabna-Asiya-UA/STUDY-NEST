import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {

  const { user, logout } = useAuth();

  return (
    <nav className="studynest-navbar">

      {/* Logo */}
      <Link
        to="/"
        className="studynest-logo"
      >
        <span className="logo-icon">
          🎓
        </span>

        <span>
          Study<span>Nest</span>
        </span>
      </Link>


      {/* Navigation */}
      <div className="studynest-nav-links">

        <NavLink
          to="/"
          className="nav-link"
        >
          Home
        </NavLink>


        {user?.role === "student" && (
          <NavLink
            to="/student/dashboard"
            className="nav-link"
          >
            Dashboard
          </NavLink>
        )}


        {user?.role === "teacher" && (
          <NavLink
            to="/teacher/dashboard"
            className="nav-link"
          >
            Dashboard
          </NavLink>
        )}


        {!user && (
          <>
            <NavLink
              to="/login"
              className="nav-link"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="nav-register"
            >
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
            <span>↪</span>
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;