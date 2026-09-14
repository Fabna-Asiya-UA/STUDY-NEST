import { useEffect, useState } from "react";

import api from "../../services/api";
import "./StudentReports.css";

function StudentReports() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/quiz-results/teacher"
      );

      setResults(
        response.data.results || []
      );
    } catch (error) {
      console.error(
        "STUDENT REPORTS ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load student reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="student-reports-page">
        <h1>Student Reports</h1>

        <p>
          Loading student reports...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-reports-page">
        <h1>Student Reports</h1>

        <div className="report-error">
          {error}
        </div>

        <button
          onClick={loadReports}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="student-reports-page">

      <div className="reports-header">

        <div>
          <h1>
            Student Reports
          </h1>

          <p>
            View student quiz performance
            and results.
          </p>
        </div>

      </div>


      <div className="reports-stats">

        <div className="report-stat-card">
          <h3>
            Total Attempts
          </h3>

          <strong>
            {results.length}
          </strong>
        </div>


        <div className="report-stat-card">
          <h3>
            Students
          </h3>

          <strong>
            {
              new Set(
                results.map(
                  (result) =>
                    result.student?._id
                )
              ).size
            }
          </strong>
        </div>


        <div className="report-stat-card">
          <h3>
            Quizzes
          </h3>

          <strong>
            {
              new Set(
                results.map(
                  (result) =>
                    result.quiz?._id
                )
              ).size
            }
          </strong>
        </div>

      </div>


      {results.length === 0 ? (

        <div className="empty-reports">

          <h2>
            No Reports Yet
          </h2>

          <p>
            Student quiz results will
            appear here after students
            complete quizzes.
          </p>

        </div>

      ) : (

        <div className="reports-table-container">

          <table className="reports-table">

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
                  Date
                </th>
              </tr>

            </thead>


            <tbody>

              {results.map(
                (result) => (

                  <tr
                    key={result._id}
                  >

                    <td>

                      <div className="student-info">

                        <strong>
                          {
                            result.student
                              ?.name ||
                            "Unknown Student"
                          }
                        </strong>

                        <span>
                          {
                            result.student
                              ?.email ||
                            ""
                          }
                        </span>

                      </div>

                    </td>


                    <td>
                      {
                        result.quiz
                          ?.title ||
                        "Unknown Quiz"
                      }
                    </td>


                    <td>
                      {
                        result.quiz
                          ?.subject ||
                        "General"
                      }
                    </td>


                    <td>
                      {result.score} /{" "}
                      {
                        result.totalQuestions
                      }
                    </td>


                    <td>

                      <span
                        className={
                          result.percentage >=
                          70
                            ? "performance-good"
                            : result.percentage >=
                              40
                            ? "performance-average"
                            : "performance-low"
                        }
                      >
                        {
                          result.percentage
                        }%
                      </span>

                    </td>


                    <td>
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
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default StudentReports;