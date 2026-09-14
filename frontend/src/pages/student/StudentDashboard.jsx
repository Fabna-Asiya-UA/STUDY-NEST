import {
  useEffect,
  useState
} from "react";
import "./StudentDashboard.css";
import {
  useNavigate
} from "react-router-dom";

import api from "../../services/api";
import Loader from "../../components/Loader";
import StudentConnectTeacher from "./StudentConnectTeacher";


function StudentDashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // FETCH DASHBOARD
  // ========================================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const response =
          await api.get(
            "/students/dashboard"
          );

        console.log(
          "STUDENT DASHBOARD DATA:",
          response.data
        );

        setDashboard(
          response.data
        );

      } catch (error) {

        console.error(
          "STUDENT DASHBOARD ERROR:",
          error.response?.data?.message ||
          error.message
        );

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return <Loader />;
  }


  // ========================================
  // SAFETY ARRAYS
  // ========================================

  const teachers =
    dashboard?.teachers || [];

  const materials =
    dashboard?.materials || [];

  const assignments =
    dashboard?.assignments || [];

  const quizzes =
    dashboard?.quizzes || [];

  const results =
    dashboard?.results || [];


  // ========================================
  // DASHBOARD
  // ========================================

  return (

    <div className="dashboard">

      <h1>
        Student Dashboard
      </h1>


      {dashboard && (

        <>

          {/* =================================
              WELCOME
          ================================= */}

          <h2>
            Welcome, {dashboard.student?.name}
          </h2>


          {/* =================================
              CONNECT TEACHER
          ================================= */}

          <StudentConnectTeacher />


          {/* =================================
              CONNECTED TEACHERS
          ================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  👨‍🏫 My Teachers
                </h2>

                <p>
                  Teachers you are currently
                  connected with.
                </p>

              </div>

              <span>
                {teachers.length}{" "}
                {teachers.length === 1
                  ? "Teacher"
                  : "Teachers"}
              </span>

            </div>


            {teachers.length === 0 ? (

              <div className="card">

                <h3>
                  No Teachers Connected
                </h3>

                <p>
                  Connect with a teacher using
                  their connection code to access
                  learning resources.
                </p>

              </div>

            ) : (

              <div className="dashboard-grid">

                {teachers.map(
                  (teacher) => (

                    <div
                      className="card"
                      key={teacher._id}
                    >

                      <div className="teacher-profile">

                        <div className="teacher-avatar">

                          {teacher.profileImage ? (

                            <img
                              src={
                                teacher.profileImage
                              }
                              alt={
                                teacher.name
                              }
                            />

                          ) : (

                            <span>
                              {teacher.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </span>

                          )}

                        </div>


                        <div>

                          <h3>
                            {teacher.name}
                          </h3>

                          <p>
                            {teacher.email}
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* =================================
              STATISTICS
          ================================= */}

          <div className="dashboard-grid">

            <div className="card">

              <h3>
                👨‍🏫 Teachers
              </h3>

              <p>
                {teachers.length}
              </p>

            </div>


            <div className="card">

              <h3>
                📚 Materials
              </h3>

              <p>
                {dashboard.counts?.materials || 0}
              </p>

            </div>


            <div className="card">

              <h3>
                📝 Assignments
              </h3>

              <p>
                {dashboard.counts?.assignments || 0}
              </p>

            </div>


            <div className="card">

              <h3>
                🧠 Quizzes
              </h3>

              <p>
                {dashboard.counts?.quizzes || 0}
              </p>

            </div>


            <div className="card">

              <h3>
                📊 Quiz Results
              </h3>

              <p>
                {dashboard.counts?.results || 0}
              </p>

            </div>

          </div>


          {/* =================================
              ASSIGNED MATERIALS
          ================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  📚 Study Materials
                </h2>

                <p>
                  Materials shared by your teachers.
                </p>

              </div>

              <span>
                {materials.length}
              </span>

            </div>


            {materials.length === 0 ? (

              <p>
                No materials available yet.
              </p>

            ) : (

              <div className="dashboard-grid">

                {materials.map(
                  (material) => (

                    <div
                      className="card"
                      key={material._id}
                    >

                      <span className="resource-badge">
                        {material.subject ||
                          "General"}
                      </span>


                      <h3>
                        {material.title}
                      </h3>


                      {material.description && (

                        <p>
                          {material.description}
                        </p>

                      )}


                      {material.teacher && (

                        <p>

                          <strong>
                            Teacher:
                          </strong>{" "}

                          {material.teacher.name}

                        </p>

                      )}


                      {material.fileUrl && (

                        <p>

                          <a
                            href={
                              material.fileUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            📄 View Material
                          </a>

                        </p>

                      )}


                      {material.videoUrl && (

                        <p>

                          <a
                            href={
                              material.videoUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            🎥 Watch Video
                          </a>

                        </p>

                      )}

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* =================================
              ASSIGNED QUIZZES
          ================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  🧠 Available Quizzes
                </h2>

                <p>
                  Take quizzes assigned by your teachers.
                </p>

              </div>

              <span>
                {quizzes.length}
              </span>

            </div>


            {quizzes.length === 0 ? (

              <p>
                No quizzes available yet.
              </p>

            ) : (

              <div className="dashboard-grid">

                {quizzes.map(
                  (quiz) => (

                    <div
                      className="card"
                      key={quiz._id}
                    >

                      <span className="resource-badge">
                        {quiz.subject ||
                          "General"}
                      </span>


                      <h3>
                        {quiz.title}
                      </h3>


                      {quiz.teacher && (

                        <p>

                          <strong>
                            Teacher:
                          </strong>{" "}

                          {quiz.teacher.name}

                        </p>

                      )}


                      <p>

                        <strong>
                          Questions:
                        </strong>{" "}

                        {quiz.questionCount || 0}

                      </p>


                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/student/quizzes/${quiz._id}`
                          )
                        }
                      >
                        Take Quiz
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* =================================
              ASSIGNED ASSIGNMENTS
          ================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  📝 My Assignments
                </h2>

                <p>
                  Assignments given by your teachers.
                </p>

              </div>

              <span>
                {assignments.length}
              </span>

            </div>


            {assignments.length === 0 ? (

              <p>
                No assignments available yet.
              </p>

            ) : (

              <div className="dashboard-grid">

                {assignments.map(
                  (assignment) => (

                    <div
                      className="card"
                      key={assignment._id}
                    >

                      <span className="resource-badge">
                        {assignment.subject ||
                          "General"}
                      </span>


                      <h3>
                        {assignment.title}
                      </h3>


                      <p>
                        {assignment.description}
                      </p>


                      {assignment.teacher && (

                        <p>

                          <strong>
                            Teacher:
                          </strong>{" "}

                          {assignment.teacher.name}

                        </p>

                      )}


                      <p>

                        <strong>
                          Due Date:
                        </strong>{" "}

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

                      </p>


                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/student/assignments/${assignment._id}`
                          )
                        }
                      >
                        View Assignment
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* =================================
              QUIZ RESULTS
          ================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  📊 My Quiz Results
                </h2>

                <p>
                  Your results from all connected teachers.
                </p>

              </div>

              <span>
                {results.length}
              </span>

            </div>


            {results.length === 0 ? (

              <p>
                No quiz results yet.
              </p>

            ) : (

              <div className="dashboard-grid">

                {results.map(
                  (result) => (

                    <div
                      className="card"
                      key={result._id}
                    >

                      <h3>
                        {result.quiz?.title ||
                          "Quiz"}
                      </h3>


                      <p>

                        <strong>
                          Subject:
                        </strong>{" "}

                        {result.quiz?.subject ||
                          "General"}

                      </p>


                      {result.teacher && (

                        <p>

                          <strong>
                            Teacher:
                          </strong>{" "}

                          {result.teacher.name}

                        </p>

                      )}


                      <p>

                        <strong>
                          Score:
                        </strong>{" "}

                        {result.score} /{" "}
                        {result.totalQuestions}

                      </p>


                      <p>

                        <strong>
                          Percentage:
                        </strong>{" "}

                        {result.percentage}%

                      </p>


                      <p>

                        <strong>
                          Attempted on:
                        </strong>{" "}

                        {new Date(
                          result.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          }
                        )}

                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </>

      )}

    </div>

  );
}


export default StudentDashboard;