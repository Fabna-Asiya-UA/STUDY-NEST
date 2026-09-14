import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Home.css";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">

      {/* HERO SECTION */}

      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-badge">
            <span>🎓</span>
            Smart Learning Platform
          </div>


          <h1>
            Welcome to{" "}
            <span>StudyNest</span>
          </h1>


          <p className="home-description">
            Your personal learning and study management
            platform designed to make learning simpler,
            smarter, and more organized.
          </p>


          {/* LOGGED OUT */}

          {!user && (
            <div className="home-actions">

              <Link
                to="/register"
                className="home-primary-btn"
              >
                Get Started
                <span>→</span>
              </Link>

              <Link
                to="/login"
                className="home-secondary-btn"
              >
                Login
              </Link>

            </div>
          )}


          {/* STUDENT */}

          {user && user.role === "student" && (
            <div className="home-actions">

              <Link
                to="/student/dashboard"
                className="home-primary-btn"
              >
                Student Dashboard
                <span>→</span>
              </Link>

            </div>
          )}


          {/* TEACHER */}

          {user && user.role === "teacher" && (
            <div className="home-actions">

              <Link
                to="/teacher/dashboard"
                className="home-primary-btn"
              >
                Teacher Dashboard
                <span>→</span>
              </Link>

            </div>
          )}

        </div>


        {/* HERO VISUAL */}

        <div className="home-visual">

          <div className="home-visual-glow"></div>

          <div className="home-learning-card">

            <div className="learning-card-icon">
              📚
            </div>

            <div>
              <h3>
                Learn Smarter
              </h3>

              <p>
                Everything you need in one place
              </p>
            </div>

          </div>


          <div className="home-floating-card home-floating-card-one">

            <span>📝</span>

            <div>
              <strong>
                Assignments
              </strong>

              <small>
                Stay organized
              </small>
            </div>

          </div>


          <div className="home-floating-card home-floating-card-two">

            <span>🧠</span>

            <div>
              <strong>
                Quizzes
              </strong>

              <small>
                Test your knowledge
              </small>
            </div>

          </div>


          <div className="home-floating-card home-floating-card-three">

            <span>📊</span>

            <div>
              <strong>
                Progress
              </strong>

              <small>
                Track your learning
              </small>
            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="home-features">

        <div className="home-section-heading">

          <span>
            Everything you need
          </span>

          <h2>
            Your Learning, Organized
          </h2>

          <p>
            StudyNest brings your learning resources,
            assignments, quizzes and progress together.
          </p>

        </div>


        <div className="home-feature-grid">

          <div className="home-feature-card">

            <div className="home-feature-icon">
              📚
            </div>

            <h3>
              Study Materials
            </h3>

            <p>
              Access notes, documents and learning
              resources shared by your teachers.
            </p>

          </div>


          <div className="home-feature-card">

            <div className="home-feature-icon">
              📝
            </div>

            <h3>
              Assignments
            </h3>

            <p>
              View assignments, submit your work and
              keep track of important deadlines.
            </p>

          </div>


          <div className="home-feature-card">

            <div className="home-feature-icon">
              🧠
            </div>

            <h3>
              Quizzes & Exams
            </h3>

            <p>
              Test your knowledge with quizzes and
              monitor your academic performance.
            </p>

          </div>


          <div className="home-feature-card">

            <div className="home-feature-icon">
              🤖
            </div>

            <h3>
              AI Assistant
            </h3>

            <p>
              Get help with your learning through your
              intelligent StudyNest AI assistant.
            </p>

          </div>

        </div>

      </section>


      {/* BOTTOM CTA */}

      {!user && (
        <section className="home-cta">

          <div>

            <h2>
              Ready to start learning?
            </h2>

            <p>
              Create your StudyNest account and
              organize your learning journey.
            </p>

          </div>


          <Link
            to="/register"
            className="home-cta-btn"
          >
            Create Account
            <span>→</span>
          </Link>

        </section>
      )}

    </div>
  );
}

export default Home;