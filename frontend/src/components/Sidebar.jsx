
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getNavClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  const handleNavClick = () => {
    if (window.innerWidth <= 700) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      className={`studynest-sidebar ${
        isOpen ? "sidebar-open" : ""
      }`}
    >

      {/* ========================================
          MOBILE CLOSE BUTTON
      ======================================== */}

      <button
        className="mobile-close-button"
        onClick={() => setIsOpen(false)}
        aria-label="Close menu"
      >
        ✕
      </button>


      {/* ========================================
          SIDEBAR HEADER
      ======================================== */}

      <div className="sidebar-header">

        <div className="sidebar-logo">
          🎓
        </div>

        <div className="sidebar-brand">

          <h2>
            Study<span>Nest</span>
          </h2>

          <p>
            Learning Platform
          </p>

        </div>

      </div>


      {/* ========================================
          VIEW PROFILE
      ======================================== */}

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? "sidebar-profile-link active"
            : "sidebar-profile-link"
        }
        onClick={handleNavClick}
      >

        <div className="sidebar-profile-icon">
          👤
        </div>

        <div className="sidebar-profile-text">

          <strong>
            View Profile
          </strong>

          <span>
            {user.role === "teacher"
              ? "Teacher Profile"
              : "Student Profile"}
          </span>

        </div>

        <span className="sidebar-profile-arrow">
          →
        </span>

      </NavLink>


      {/* ========================================
          USER INFORMATION
      ======================================== */}

      <div className="sidebar-user">

        <div className="sidebar-user-avatar">

          {user.name
            ?.charAt(0)
            ?.toUpperCase()}

        </div>

        <div className="sidebar-user-info">

          <strong>
            {user.name}
          </strong>

          <span>
            {user.role}
          </span>

        </div>

      </div>


      {/* ========================================
          NAVIGATION
      ======================================== */}

      <nav
        className="sidebar-navigation"
        onClick={handleNavClick}
      >

        <p className="sidebar-section-title">
          MAIN MENU
        </p>


        {/* ========================================
            STUDENT MENU
        ======================================== */}

        {user.role === "student" && (
          <>

            <NavLink
              to="/student/dashboard"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                🏠
              </span>

              <span>
                Dashboard
              </span>
            </NavLink>


            <NavLink
              to="/student/materials"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📚
              </span>

              <span>
                Materials
              </span>
            </NavLink>


            <NavLink
              to="/student/assignments"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📝
              </span>

              <span>
                Assignments
              </span>
            </NavLink>


            <NavLink
              to="/student/quizzes"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                🧠
              </span>

              <span>
                Quizzes
              </span>
            </NavLink>


            <NavLink
              to="/student/exams"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📋
              </span>

              <span>
                Exams
              </span>
            </NavLink>


            <NavLink
              to="/student/notes"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📒
              </span>

              <span>
                Personal Notes
              </span>
            </NavLink>


            <NavLink
              to="/student/goals"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                🎯
              </span>

              <span>
                Study Goals
              </span>
            </NavLink>


            <NavLink
              to="/student/ai"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                🤖
              </span>

              <span>
                AI Assistant
              </span>
            </NavLink>


            <NavLink
              to="/student/performance"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📊
              </span>

              <span>
                Performance
              </span>
            </NavLink>

          </>
        )}


        {/* ========================================
            TEACHER MENU
        ======================================== */}

        {user.role === "teacher" && (
          <>

            <NavLink
              to="/teacher/dashboard"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                🏠
              </span>

              <span>
                Dashboard
              </span>
            </NavLink>


            <NavLink
              to="/teacher/students"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                👨‍🎓
              </span>

              <span>
                Students
              </span>
            </NavLink>


            <NavLink
              to="/teacher/materials"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📚
              </span>

              <span>
                Materials
              </span>
            </NavLink>


            <NavLink
              to="/teacher/assignments/create"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📝
              </span>

              <span>
                Create Assignment
              </span>
            </NavLink>


            <NavLink
              to="/teacher/quizzes/create"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                🧠
              </span>

              <span>
                Create Quiz
              </span>
            </NavLink>


            <NavLink
              to="/teacher/exams/create"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📋
              </span>

              <span>
                Create Exam
              </span>
            </NavLink>


            <NavLink
              to="/teacher/results"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📊
              </span>

              <span>
                Results
              </span>
            </NavLink>


            <NavLink
              to="/teacher/reports"
              className={getNavClass}
            >
              <span className="sidebar-link-icon">
                📑
              </span>

              <span>
                Student Reports
              </span>
            </NavLink>

          </>
        )}

      </nav>


      {/* ========================================
          SIDEBAR FOOTER
      ======================================== */}

      <div className="sidebar-footer">

        <div className="sidebar-footer-icon">
          ✨
        </div>

        <div>

          <strong>
            Keep Learning
          </strong>

          <span>
            Your progress matters.
          </span>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
