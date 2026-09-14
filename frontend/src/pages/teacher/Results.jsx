import { useEffect, useState } from "react";

import api from "../../services/api";
import Loader from "../../components/Loader";
import "./Results.css";

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD TEACHER RESULTS
  // ========================================

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/quiz-results/teacher"
      );

      console.log(
        "TEACHER QUIZ RESULTS:",
        response.data
      );

      setResults(
        response.data.results || []
      );
    } catch (error) {
      console.error(
        "FETCH RESULTS ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load quiz results"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD RESULTS WHEN PAGE OPENS
  // ========================================

  useEffect(() => {
    loadResults();
  }, []);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return <Loader />;
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="results-page">

        <div className="results-error">

          <h2>
            Unable to load results
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadResults}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ========================================
  // STATISTICS
  // ========================================

  const totalSubmissions =
    results.length;

  const averagePercentage =
    totalSubmissions > 0
      ? (
          results.reduce(
            (total, result) =>
              total +
              Number(
                result.percentage || 0
              ),
            0
          ) / totalSubmissions
        ).toFixed(1)
      : 0;

  const passedStudents =
    results.filter(
      (result) =>
        Number(result.percentage || 0) >= 40
    ).length;

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // ========================================
  // GET SCORE CLASS
  // ========================================

  const getScoreClass = (percentage) => {
    if (percentage >= 80) {
      return "excellent";
    }

    if (percentage >= 60) {
      return "good";
    }

    if (percentage >= 40) {
      return "average";
    }

    return "poor";
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="results-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="results-header">

        <div>
          <h1>
            Quiz Results
          </h1>

          <p>
            View and track your students'
            quiz performance.
          </p>
        </div>

        <button
          className="refresh-results-btn"
          onClick={loadResults}
        >
          ↻ Refresh
        </button>

      </div>


      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="results-stats">

        {/* TOTAL SUBMISSIONS */}

        <div className="result-stat-card">

          <div className="stat-icon">
            📝
          </div>

          <div>
            <span>
              Total Submissions
            </span>

            <strong>
              {totalSubmissions}
            </strong>
          </div>

        </div>


        {/* AVERAGE SCORE */}

        <div className="result-stat-card">

          <div className="stat-icon">
            📊
          </div>

          <div>
            <span>
              Average Score
            </span>

            <strong>
              {averagePercentage}%
            </strong>
          </div>

        </div>


        {/* PASSED */}

        <div className="result-stat-card">

          <div className="stat-icon">
            🎯
          </div>

          <div>
            <span>
              Passed
            </span>

            <strong>
              {passedStudents}
            </strong>
          </div>

        </div>


        {/* QUIZ COUNT */}

        <div className="result-stat-card">

          <div className="stat-icon">
            🧠
          </div>

          <div>
            <span>
              Results Available
            </span>

            <strong>
              {results.length}
            </strong>
          </div>

        </div>

      </div>


      {/* ========================================
          RESULTS TABLE
      ======================================== */}

      <div className="results-card">

        <div className="results-card-header">

          <div>
            <h2>
              Student Performance
            </h2>

            <p>
              Detailed quiz submission results
            </p>
          </div>

        </div>


        {results.length === 0 ? (

          <div className="empty-results">

            <div className="empty-results-icon">
              📊
            </div>

            <h2>
              No Results Yet
            </h2>

            <p>
              Students have not submitted
              any quizzes yet.
            </p>

          </div>

        ) : (

          <div className="results-table-wrapper">

            <table className="results-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Quiz
                  </th>

                  <th>
                    Subject
                  </th>

                  <th>
                    Score
                  </th>

                  <th>
                    Percentage
                  </th>

                  <th>
                    Submitted
                  </th>

                </tr>

              </thead>


              <tbody>

                {results.map(
                  (result) => {

                    const percentage =
                      Number(
                        result.percentage || 0
                      );

                    return (
                      <tr
                        key={result._id}
                      >

                        {/* STUDENT */}

                        <td>

                          <div className="student-info">

                            <div className="student-avatar">

                              {result.student?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "S"}

                            </div>

                            <div>

                              <strong>
                                {result.student?.name ||
                                  "Unknown Student"}
                              </strong>

                              <span>
                                {result.student?.email ||
                                  "No email"}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* QUIZ */}

                        <td>

                          <strong>
                            {result.quiz?.title ||
                              "Unknown Quiz"}
                          </strong>

                        </td>


                        {/* SUBJECT */}

                        <td>

                          <span className="subject-badge">

                            {result.quiz?.subject ||
                              "N/A"}

                          </span>

                        </td>


                        {/* SCORE */}

                        <td>

                          <strong className="score-value">

                            {result.score}
                            /
                            {result.totalQuestions}

                          </strong>

                        </td>


                        {/* PERCENTAGE */}

                        <td>

                          <span
                            className={`percentage-badge ${getScoreClass(
                              percentage
                            )}`}
                          >
                            {percentage}%
                          </span>

                        </td>


                        {/* DATE */}

                        <td>

                          <span className="submitted-date">

                            {formatDate(
                              result.createdAt
                            )}

                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Results;