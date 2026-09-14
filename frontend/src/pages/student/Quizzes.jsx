import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Loader from "../../components/Loader";

import "./Quizzes.css";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/quizzes");

        setQuizzes(
          response.data.quizzes || []
        );
      } catch (error) {
        console.error(
          "FETCH QUIZZES ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load quizzes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="quizzes-page">

      {/* HEADER */}

      <div className="quizzes-header">

        <div className="quizzes-header-content">

          <div className="quizzes-icon">
            🧠
          </div>

          <div>
            <h1>
              Quizzes
            </h1>

            <p>
              Test your knowledge and track
              your learning progress.
            </p>
          </div>

        </div>

        <div className="quiz-count">
          {quizzes.length}{" "}
          {quizzes.length === 1
            ? "Quiz"
            : "Quizzes"}
        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="quiz-error">
          ❌ {error}
        </div>
      )}


      {/* EMPTY STATE */}

      {quizzes.length === 0 ? (

        <div className="empty-quiz-state">

          <div className="empty-quiz-icon">
            🧠
          </div>

          <h2>
            No Quizzes Available
          </h2>

          <p>
            Your teachers have not created
            any quizzes yet.
          </p>

        </div>

      ) : (

        <div className="quizzes-content">

          {/* SECTION HEADER */}

          <div className="quizzes-section-header">

            <div>
              <h2>
                Available Quizzes
              </h2>

              <p>
                Choose a quiz and test your
                knowledge.
              </p>
            </div>

            <span className="available-label">
              {quizzes.length} Available
            </span>

          </div>


          {/* QUIZ GRID */}

          <div className="quiz-grid">

            {quizzes.map((quiz) => (

              <div
                className="quiz-card"
                key={quiz._id}
              >

                {/* CARD TOP */}

                <div className="quiz-card-top">

                  <div className="quiz-card-icon">
                    🧠
                  </div>

                  <span className="quiz-subject">
                    {quiz.subject ||
                      "General"}
                  </span>

                </div>


                {/* TITLE */}

                <h2>
                  {quiz.title}
                </h2>


                {/* DESCRIPTION */}

                <p className="quiz-description">
                  Test your knowledge on{" "}
                  {quiz.subject ||
                    "this subject"}.
                </p>


                {/* TEACHER / QUESTIONS */}

                <div className="quiz-info">

                  <div className="quiz-info-item">

                    <span className="quiz-info-icon">
                      📝
                    </span>

                    <div>
                      <span>
                        Questions
                      </span>

                      <strong>
                        {quiz.questionCount ||
                          quiz.questions?.length ||
                          0}
                      </strong>
                    </div>

                  </div>


                  <div className="quiz-info-item">

                    <span className="quiz-info-icon">
                      👨‍🏫
                    </span>

                    <div>
                      <span>
                        Teacher
                      </span>

                      <strong>
                        {quiz.teacher?.name ||
                          "Teacher"}
                      </strong>
                    </div>

                  </div>

                </div>


                {/* START BUTTON */}

                <button
                  type="button"
                  className="start-quiz-btn"
                  onClick={() =>
                    navigate(
                      `/student/quizzes/${quiz._id}`
                    )
                  }
                >
                  <span>
                    Start Quiz
                  </span>

                  <span className="quiz-arrow">
                    →
                  </span>
                </button>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default Quizzes;