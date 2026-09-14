import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";
import api from "../../services/api";
import ConnectionRequests from "./ConnectionRequests";

function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/teachers/dashboard"
      );

      console.log(
        "TEACHER DASHBOARD DATA:",
        response.data
      );

      setDashboard(response.data);
    } catch (error) {
      console.error(
        "TEACHER DASHBOARD ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load teacher dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <h2>
          Loading teacher dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          {error}
        </div>

        <button onClick={loadDashboard}>
          Try Again
        </button>
      </div>
    );
  }

  // ========================================
  // DASHBOARD DATA
  // ========================================

  const studentCount =
    dashboard?.stats?.students ?? 0;

  const materialCount =
    dashboard?.stats?.materials ?? 0;

  const assignmentCount =
    dashboard?.stats?.assignments ?? 0;

  const quizCount =
    dashboard?.stats?.quizzes ?? 0;

  const students =
    dashboard?.recentStudents ?? [];

  const materials =
    dashboard?.recentMaterials ?? [];

  const assignments =
    dashboard?.recentAssignments ?? [];

  const quizzes =
    dashboard?.recentQuizzes ?? [];


  return (
    <div className="dashboard">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="dashboard-header">

        <h1>
          Teacher Dashboard
        </h1>

        <h2>
          Welcome, {user?.name}
        </h2>

        <p>
          Manage students, materials,
          assignments and quizzes.
        </p>

      </div>


      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="dashboard-grid">

        {/* STUDENTS */}

        <div className="card">

          <h3>
            👨‍🎓 Students
          </h3>

          <div className="dashboard-number">
            {studentCount}
          </div>

          <p>
            Connected students
          </p>

        </div>


        {/* MATERIALS */}

        <div className="card">

          <h3>
            📚 Materials
          </h3>

          <div className="dashboard-number">
            {materialCount}
          </div>

          <p>
            Study materials
          </p>

        </div>


        {/* ASSIGNMENTS */}

        <div className="card">

          <h3>
            📝 Assignments
          </h3>

          <div className="dashboard-number">
            {assignmentCount}
          </div>

          <p>
            Created assignments
          </p>

        </div>


        {/* QUIZZES */}

        <div className="card">

          <h3>
            🧠 Quizzes
          </h3>

          <div className="dashboard-number">
            {quizCount}
          </div>

          <p>
            Created quizzes
          </p>

        </div>

      </div>


      {/* ========================================
          CONNECTION REQUESTS
      ======================================== */}

      <ConnectionRequests
        onAccepted={loadDashboard}
      />


      {/* ========================================
          RECENT STUDENTS
      ======================================== */}

      <div className="card dashboard-section">

        <h2>
          Recent Students
        </h2>

        {students.length === 0 ? (

          <div className="empty-state">

            <p>
              No students are connected yet.
            </p>

            <p>
              Ask students to connect using
              your teacher connection code.
            </p>

          </div>

        ) : (

          <div className="student-list">

            {students.map((student) => (

              <div
                className="student-item"
                key={student._id}
              >

                <div>

                  <h3>
                    {student.name}
                  </h3>

                  <p>
                    {student.email}
                  </p>

                </div>

                <span className="badge">
                  Student
                </span>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ========================================
          RECENT MATERIALS
      ======================================== */}

      <div className="card dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Recent Materials
            </h2>

            <p>
              Your latest study materials
            </p>

          </div>

          <button
            className="view-all-button"
            onClick={() =>
              navigate(
                "/teacher/materials"
              )
            }
          >
            View All
          </button>

        </div>


        {materials.length === 0 ? (

          <div className="empty-state">

            <p>
              No materials have been
              uploaded yet.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/teacher/materials/upload"
                )
              }
            >
              Upload Material
            </button>

          </div>

        ) : (

          <div className="material-list">

            {materials.map(
              (material) => (

                <div
                  className="material-item"
                  key={material._id}
                >

                  <div>

                    <h3>
                      {material.title}
                    </h3>

                    <p>
                      {material.subject ||
                        "General"}
                    </p>

                    <small>
                      {material.fileUrl
                        ? "📄 File"
                        : ""}

                      {material.fileUrl &&
                        material.videoUrl
                        ? "  •  "
                        : ""}

                      {material.videoUrl
                        ? "▶ Video"
                        : ""}
                    </small>

                  </div>

                  <span className="badge">
                    Material
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ========================================
          RECENT ASSIGNMENTS
      ======================================== */}

      <div className="card dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Recent Assignments
            </h2>

            <p>
              Your latest assignments
            </p>

          </div>

          <button
            className="view-all-button"
            onClick={() =>
             navigate("/teacher/assignments/create")
            }
          >
            View All
          </button>

        </div>


        {assignments.length === 0 ? (

          <div className="empty-state">

            <p>
              No assignments have been
              created yet.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/teacher/assignments/create"
                )
              }
            >
              Create Assignment
            </button>

          </div>

        ) : (

          <div className="assignment-list">

            {assignments.map(
              (assignment) => (

                <div
                  className="assignment-item"
                  key={assignment._id}
                >

                  <div>

                    <h3 style={{color:"blue"}}>
                      {assignment.title}
                    </h3>

                    <p>
                      {assignment.subject ||
                        "General"}
                    </p>

                    <small>
                      Due:{" "}
                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }
                      )}
                    </small>

                  </div>

                <br />

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ========================================
          RECENT QUIZZES
      ======================================== */}

      <div className="card dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Recent Quizzes
            </h2>

            <p>
              Your latest quizzes
            </p>

          </div>

          <button
            className="view-all-button"
            onClick={() =>
             navigate("/teacher/quizzes/create")
            }
          >
            View All
          </button>

        </div>


        {quizzes.length === 0 ? (

          <div className="empty-state">

            <p>
              No quizzes have been created yet.
            </p>

          </div>

        ) : (

          <div className="quiz-list">

            {quizzes.map((quiz) => (

              <div
                className="quiz-item"
                key={quiz._id}
              >

                <div>

                  <h3>
                    {quiz.title}
                  </h3>

                  <p>
                    {quiz.subject}
                  </p>

                  <small>
                    {quiz.questions?.length || 0}{" "}
                    questions
                  </small>

                </div>

                <span className="badge">
                  Quiz
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default TeacherDashboard;