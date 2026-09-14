import { useEffect, useState } from "react";
import "./Performance.css";
import api from "../../services/api";
import Loader from "../../components/Loader";

function Performance() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await api.get(
          "/quiz-results/student"
        );

        setResults(
          response.data.results || []
        );
      } catch (error) {
        console.error(
          "FETCH PERFORMANCE ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load performance"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const totalAttempts = results.length;

  const averagePercentage =
    totalAttempts > 0
      ? (
          results.reduce(
            (total, result) =>
              total + result.percentage,
            0
          ) / totalAttempts
        ).toFixed(1)
      : 0;

  const highestPercentage =
    totalAttempts > 0
      ? Math.max(
          ...results.map(
            (result) => result.percentage
          )
        )
      : 0;

  return (
    <div className="performance-page">

      <div className="performance-header">

        <div>
          <h1>
            Performance
          </h1>

          <p>
            Track your quiz performance
            and learning progress.
          </p>
        </div>

      </div>


      {error && (
        <div className="performance-error">
          {error}
        </div>
      )}


      <div className="performance-summary">

        <div className="performance-stat">
          <span>
            Total Attempts
          </span>

          <strong>
            {totalAttempts}
          </strong>
        </div>


        <div className="performance-stat">
          <span>
            Average Score
          </span>

          <strong>
            {averagePercentage}%
          </strong>
        </div>


        <div className="performance-stat">
          <span>
            Highest Score
          </span>

          <strong>
            {highestPercentage}%
          </strong>
        </div>

      </div>


      {results.length === 0 ? (

        <div className="performance-empty">

          <div className="empty-icon">
            📊
          </div>

          <h2>
            No Performance Data Yet
          </h2>

          <p>
            Complete a quiz to see your
            performance here.
          </p>

        </div>

      ) : (

        <div className="performance-results">

          <div className="section-header">

            <div>
              <h2>
                Quiz Results
              </h2>

              <p>
                Your recent quiz performance.
              </p>
            </div>

          </div>


          <div className="results-grid">

            {results.map((result) => (

              <div
                className="result-card"
                key={result._id}
              >

                <div className="result-card-header">

                  <div>

                    <h3>
                      {result.quiz?.title ||
                        "Quiz"}
                    </h3>

                    <p>
                      {result.quiz?.subject ||
                        "General"}
                    </p>

                  </div>

                  <strong>
                    {result.percentage}%
                  </strong>

                </div>


                <div className="result-details">

                  <div>
                    <span>
                      Score
                    </span>

                    <strong>
                      {result.score}/
                      {result.totalQuestions}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Date
                    </span>

                    <strong>
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
                    </strong>
                  </div>

                </div>


                <div className="result-progress">

                  <div
                    className="result-progress-bar"
                    style={{
                      width: `${result.percentage}%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default Performance;