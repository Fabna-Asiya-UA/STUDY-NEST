import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TakeQuiz.css";
import api from "../../services/api";
import Loader from "../../components/Loader";


function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(
          `/quizzes/${id}`
        );

        setQuiz(response.data.quiz);
      } catch (error) {
        console.error(
          "FETCH QUIZ ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load quiz"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (
    questionId,
    answer
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!quiz) {
      return;
    }

    const unansweredQuestions =
      quiz.questions.filter(
        (question) =>
          !answers[question._id]
      );

    if (unansweredQuestions.length > 0) {
      alert(
        "Please answer all questions before submitting."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers =
        quiz.questions.map((question) => ({
          questionId: question._id,
          answer: answers[question._id]
        }));

      const response = await api.post(
        `/quizzes/${id}/submit`,
        {
          answers: formattedAnswers
        }
      );

      console.log(
        "QUIZ RESULT:",
        response.data
      );

      navigate(
        "/student/quizzes/result",
        {
          state: {
            result: response.data.result
          }
        }
      );
    } catch (error) {
      console.error(
        "SUBMIT QUIZ ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit quiz"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error && !quiz) {
    return (
      <div className="quiz-error-page">
        <h2>
          Unable to load quiz
        </h2>

        <p>{error}</p>

        <button
          onClick={() =>
            navigate(
              "/student/quizzes"
            )
          }
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="take-quiz-page">

      <div className="take-quiz-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(
              "/student/quizzes"
            )
          }
        >
          ← Back to Quizzes
        </button>

        <span className="quiz-subject">
          {quiz.subject}
        </span>

        <h1>
          {quiz.title}
        </h1>

        <p>
          Answer all the questions and
          submit your quiz.
        </p>

      </div>

      {error && (
        <div className="quiz-submit-error">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="questions-container"
      >

        {quiz.questions.map(
          (question, index) => (
            <div
              className="question-card"
              key={question._id}
            >

              <div className="question-number">
                Question {index + 1}
              </div>

              <h2>
                {question.question}
              </h2>

              <div className="options-list">

                {question.options.map(
                  (
                    option,
                    optionIndex
                  ) => (
                    <label
                      className={
                        answers[
                          question._id
                        ] === option
                          ? "option selected"
                          : "option"
                      }
                      key={optionIndex}
                    >

                      <input
                        type="radio"
                        name={`question-${question._id}`}
                        value={option}
                        checked={
                          answers[
                            question._id
                          ] === option
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question._id,
                            option
                          )
                        }
                      />

                      <span>
                        {option}
                      </span>

                    </label>
                  )
                )}

              </div>

            </div>
          )
        )}

        <div className="submit-quiz-section">

          <p>
            Make sure you have answered
            all questions.
          </p>

          <button
            type="submit"
            className="submit-quiz-btn"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Quiz"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default TakeQuiz;