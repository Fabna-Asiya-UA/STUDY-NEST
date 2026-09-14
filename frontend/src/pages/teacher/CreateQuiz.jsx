import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./CreateQuiz.css";

function CreateQuiz() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      answer: ""
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ========================================
  // LOAD EXISTING QUIZZES
  // ========================================

  const loadQuizzes = async () => {
    try {
      setLoadingQuizzes(true);

      const response = await api.get(
        "/quizzes/teacher"
      );

      setQuizzes(
        response.data.quizzes || []
      );
    } catch (error) {
      console.error(
        "LOAD QUIZZES ERROR:",
        error.response?.data ||
          error.message
      );
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  // ========================================
  // DELETE QUIZ
  // ========================================

  const handleDeleteQuiz = async (quizId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/quizzes/${quizId}`
      );

      setQuizzes((previousQuizzes) =>
        previousQuizzes.filter(
          (quiz) =>
            quiz._id !== quizId
        )
      );

      setMessage(
        "Quiz deleted successfully"
      );

      setError("");
    } catch (error) {
      console.error(
        "DELETE QUIZ ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete quiz"
      );
    }
  };

  // ========================================
  // QUESTION CHANGE
  // ========================================

  const handleQuestionChange = (
    questionIndex,
    value
  ) => {
    const updatedQuestions =
      [...questions];

    updatedQuestions[
      questionIndex
    ].question = value;

    setQuestions(updatedQuestions);
  };

  // ========================================
  // OPTION CHANGE
  // ========================================

  const handleOptionChange = (
    questionIndex,
    optionIndex,
    value
  ) => {
    const updatedQuestions =
      [...questions];

    updatedQuestions[
      questionIndex
    ].options[optionIndex] = value;

    setQuestions(updatedQuestions);
  };

  // ========================================
  // ANSWER CHANGE
  // ========================================

  const handleAnswerChange = (
    questionIndex,
    value
  ) => {
    const updatedQuestions =
      [...questions];

    updatedQuestions[
      questionIndex
    ].answer = value;

    setQuestions(updatedQuestions);
  };

  // ========================================
  // ADD QUESTION
  // ========================================

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: ""
      }
    ]);
  };

  // ========================================
  // REMOVE QUESTION
  // ========================================

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      return;
    }

    const updatedQuestions =
      questions.filter(
        (_, questionIndex) =>
          questionIndex !== index
      );

    setQuestions(updatedQuestions);
  };

  // ========================================
  // CREATE QUIZ
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError(
        "Please enter a quiz title"
      );
      return;
    }

    if (!subject.trim()) {
      setError(
        "Please enter a subject"
      );
      return;
    }

    for (
      let i = 0;
      i < questions.length;
      i++
    ) {
      const currentQuestion =
        questions[i];

      if (
        !currentQuestion.question.trim()
      ) {
        setError(
          `Please enter question ${i + 1}`
        );
        return;
      }

      const hasEmptyOption =
        currentQuestion.options.some(
          (option) =>
            !option.trim()
        );

      if (hasEmptyOption) {
        setError(
          `Please fill all options for question ${
            i + 1
          }`
        );
        return;
      }

      if (!currentQuestion.answer) {
        setError(
          `Please select the correct answer for question ${
            i + 1
          }`
        );
        return;
      }
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/quizzes",
        {
          title: title.trim(),
          subject: subject.trim(),
          questions
        }
      );

      setMessage(
        response.data.message ||
          "Quiz created successfully"
      );

      setTitle("");
      setSubject("");

      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          answer: ""
        }
      ]);

      // Refresh existing quizzes
      loadQuizzes();

    } catch (error) {
      console.error(
        "CREATE QUIZ ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to create quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="create-quiz-header">

        <div>

          <div className="quiz-badge">
            📝 Quiz Builder
          </div>

          <h1>
            Create Quiz
          </h1>

          <p>
            Create interactive quizzes
            for your connected students.
          </p>

        </div>

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/teacher/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>


      {/* ========================================
          EXISTING QUIZZES
      ======================================== */}

      <div className="existing-quizzes-section">

        <div className="existing-quizzes-header">

          <div>
            <h2>
              Your Quizzes
            </h2>

            <p>
              Manage the quizzes you have
              already created.
            </p>
          </div>

          <span className="quiz-count">
            {quizzes.length}{" "}
            {quizzes.length === 1
              ? "Quiz"
              : "Quizzes"}
          </span>

        </div>


        {loadingQuizzes ? (

          <div className="quiz-loading">
            Loading quizzes...
          </div>

        ) : quizzes.length === 0 ? (

          <div className="quiz-empty">

            <div className="quiz-empty-icon">
              📝
            </div>

            <h3>
              No quizzes yet
            </h3>

            <p>
              Create your first quiz using
              the form below.
            </p>

          </div>

        ) : (

          <div className="existing-quizzes-grid">

            {quizzes.map((quiz) => (

              <div
                className="existing-quiz-card"
                key={quiz._id}
              >

                <div className="existing-quiz-top">

                  <span className="quiz-subject">
                    {quiz.subject}
                  </span>

                  <button
                    type="button"
                    className="delete-quiz-button"
                    onClick={() =>
                      handleDeleteQuiz(
                        quiz._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>


                <h3>
                  {quiz.title}
                </h3>


                <div className="quiz-card-info">

                  <span>
                    📝{" "}
                    {quiz.questions?.length ||
                      0}{" "}
                    Questions
                  </span>

                  <span>
                    📅{" "}
                    {new Date(
                      quiz.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ========================================
          CREATE QUIZ FORM
      ======================================== */}

      <form
        className="quiz-form"
        onSubmit={handleSubmit}
      >

        <div className="quiz-details-card">

          <div className="section-title">

            <span>📋</span>

            <div>

              <h2>
                Create New Quiz
              </h2>

              <p>
                Add the basic details of
                your quiz.
              </p>

            </div>

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>
                Quiz Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Example: Python Basics Quiz"
              />

            </div>


            <div className="form-group">

              <label>
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) =>
                  setSubject(
                    e.target.value
                  )
                }
                placeholder="Example: Python"
              />

            </div>

          </div>

        </div>


        {/* ========================================
            QUESTIONS
        ======================================== */}

        <div className="questions-section">

          <div className="questions-section-header">

            <div>

              <h2>
                Questions
              </h2>

              <p>
                Add questions and select
                the correct answer.
              </p>

            </div>

            <span className="question-count">
              {questions.length}{" "}
              {questions.length === 1
                ? "Question"
                : "Questions"}
            </span>

          </div>


          {questions.map(
            (
              question,
              questionIndex
            ) => (

              <div
                className="question-card"
                key={questionIndex}
              >

                <div className="question-card-header">

                  <div className="question-number">
                    Question{" "}
                    {questionIndex + 1}
                  </div>

                  {questions.length >
                    1 && (

                    <button
                      type="button"
                      className="remove-question"
                      onClick={() =>
                        removeQuestion(
                          questionIndex
                        )
                      }
                    >
                      Remove
                    </button>

                  )}

                </div>


                <div className="form-group">

                  <label>
                    Question
                  </label>

                  <textarea
                    value={
                      question.question
                    }
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        e.target.value
                      )
                    }
                    placeholder="Enter your question..."
                    rows="3"
                  />

                </div>


                <div className="options-header">

                  <label>
                    Answer Options
                  </label>

                  <span>
                    Select the correct
                    answer below
                  </span>

                </div>


                <div className="options-grid">

                  {question.options.map(
                    (
                      option,
                      optionIndex
                    ) => {

                      const optionLetter =
                        String.fromCharCode(
                          65 +
                            optionIndex
                        );

                      return (

                        <div
                          className="option-item"
                          key={optionIndex}
                        >

                          <div className="option-label">
                            {
                              optionLetter
                            }
                          </div>

                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${optionLetter}`}
                          />

                        </div>

                      );

                    }
                  )}

                </div>


                <div className="correct-answer-section">

                  <label>
                    Correct Answer
                  </label>

                  <select
                    value={
                      question.answer
                    }
                    onChange={(e) =>
                      handleAnswerChange(
                        questionIndex,
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select correct answer
                    </option>

                    {question.options.map(
                      (
                        option,
                        optionIndex
                      ) => (

                        <option
                          key={optionIndex}
                          value={option}
                          disabled={
                            !option.trim()
                          }
                        >
                          Option{" "}
                          {String.fromCharCode(
                            65 +
                              optionIndex
                          )}
                          {option
                            ? ` - ${option}`
                            : ""}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

            )
          )}


          <button
            type="button"
            className="add-question-button"
            onClick={addQuestion}
          >
            <span>+</span>
            Add Another Question
          </button>

        </div>


        {/* ========================================
            MESSAGES
        ======================================== */}

        {message && (

          <div className="quiz-success">

            <span>✓</span>

            {message}

          </div>

        )}


        {error && (

          <div className="quiz-error">

            <span>!</span>

            {error}

          </div>

        )}


        {/* ========================================
            SUBMIT
        ======================================== */}

        <div className="quiz-submit-section">

          <div>

            <strong>
              Ready to publish?
            </strong>

            <p>
              Your quiz will be available
              to your connected students.
            </p>

          </div>

          <button
            type="submit"
            className="create-quiz-button"
            disabled={loading}
          >
            {loading
              ? "Creating Quiz..."
              : "Create Quiz"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default CreateQuiz;