
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Exams.css";
import api from "../../services/api";
import Loader from "../../components/Loader";

function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get("/quizzes");

        setExams(response.data.quizzes || []);
      } catch (error) {
        console.error("FETCH EXAMS ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load exams"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="exams-page">

      {/* Header */}
      <div className="exams-header">
        <div className="exams-heading">

          <div className="exams-icon">
            📝
          </div>

          <div>
            <h1>Exams</h1>

            <p>
              View and attend exams created by your teacher.
            </p>
          </div>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="exam-error">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="exam-summary">

        <div className="summary-icon">
          📝
        </div>

        <div>
          <span className="summary-label">
            Available Exams
          </span>

          <strong className="summary-value">
            {exams.length}
          </strong>
        </div>

      </div>

      {/* No Exams */}
      {exams.length === 0 ? (

        <div className="exams-empty">

          <div className="empty-icon">
            📝
          </div>

          <h2>
            No Exams Available
          </h2>

          <p>
            Your teacher has not created any exams yet.
          </p>

        </div>

      ) : (

        <div className="exams-section">

          {/* Section Header */}
          <div className="section-header">

            <div>
              <h2>
                Available Exams
              </h2>

              <p>
                Select an exam to start.
              </p>
            </div>

            <span className="exam-count">
              {exams.length}{" "}
              {exams.length === 1 ? "Exam" : "Exams"}
            </span>

          </div>

          {/* Exam Cards */}
          <div className="exams-grid">

            {exams.map((exam) => (

              <div
                className="exam-card"
                key={exam._id}
              >

                <div className="exam-card-top">

                  <span className="exam-subject">
                    {exam.subject || "General"}
                  </span>

                  <span className="exam-status">
                    Available
                  </span>

                </div>

                <h3>
                  {exam.title}
                </h3>

                <p>
                  Test your knowledge by completing this exam.
                </p>

                <div className="exam-info">

                  <div>
                    <span>
                      📚 Subject
                    </span>

                    <strong>
                      {exam.subject || "General"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      ❓ Questions
                    </span>

                    <strong>
                      {exam.questions?.length || 0}
                    </strong>
                  </div>

                </div>

                {/* Start Exam */}
                <Link
                  to={`/student/exams/${exam._id}`}
                  className="start-exam-link"
                >
                  <button
                    type="button"
                    className="start-exam-btn"
                  >
                    Start Exam
                  </button>
                </Link>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default Exams;

