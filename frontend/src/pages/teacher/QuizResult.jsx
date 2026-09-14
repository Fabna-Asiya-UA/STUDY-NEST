import { useLocation, useNavigate } from "react-router-dom";


function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;

  if (!result) {
    return (
      <div className="quiz-result-page">
        <div className="result-card">
          <h1>Result Not Found</h1>

          <p>
            Your quiz result is not available.
          </p>

          <button
            onClick={() =>
              navigate("/student/quizzes")
            }
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const percentage = result.percentage;

  let resultMessage = "Keep practicing!";

  if (percentage >= 80) {
    resultMessage = "Excellent work!";
  } else if (percentage >= 60) {
    resultMessage = "Good job!";
  } else if (percentage >= 40) {
    resultMessage = "Nice effort! Keep improving.";
  }

  return (
    <div className="quiz-result-page">
      <div className="result-card">

        <div className="result-icon">
          🎉
        </div>

        <p className="result-label">
          Quiz Completed
        </p>

        <h1>
          {result.quizTitle}
        </h1>

        <p className="result-message">
          {resultMessage}
        </p>

        <div className="score-circle">
          <span className="score-percentage">
            {percentage}%
          </span>

          <span className="score-text">
            Score
          </span>
        </div>

        <div className="score-details">

          <div className="score-item">
            <span>Correct Answers</span>

            <strong>
              {result.score}
            </strong>
          </div>

          <div className="score-item">
            <span>Total Questions</span>

            <strong>
              {result.totalQuestions}
            </strong>
          </div>

          <div className="score-item">
            <span>Percentage</span>

            <strong>
              {percentage}%
            </strong>
          </div>

        </div>

        <button
          className="back-to-quizzes-btn"
          onClick={() =>
            navigate("/student/quizzes")
          }
        >
          Back to Quizzes
        </button>

      </div>
    </div>
  );
}

export default QuizResult;