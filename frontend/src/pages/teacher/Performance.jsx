import {
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../../services/api";
import Loader from "../../components/Loader";

function Performance() {
  const [performance, setPerformance] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");


  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response =
          await api.get(
            "/teachers/performance"
          );

        setPerformance(
          response.data
        );

      } catch (error) {
        console.error(
          "FETCH PERFORMANCE ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load performance data"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);


  const students =
    performance?.students || [];


  const filteredStudents =
    useMemo(() => {
      return students.filter(
        (student) => {

          const matchesSearch =
            student.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            student.email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );


          const score =
            Number(
              student.averageScore || 0
            );


          const matchesFilter =
            filter === "all"
              ? true
              : filter === "good"
              ? score >= 75
              : filter === "average"
              ? score >= 50 &&
                score < 75
              : score < 50;


          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      students,
      search,
      filter
    ]);


  const averageScore =
    Number(
      performance?.averageScore || 0
    );


  const totalStudents =
    Number(
      performance?.totalStudents || 0
    );


  const totalExams =
    Number(
      performance?.totalExams || 0
    );


  const completedExams =
    Number(
      performance?.completedExams || 0
    );


  const completionRate =
    totalExams > 0
      ? Math.round(
          (completedExams /
            totalExams) *
            100
        )
      : 0;


  const topStudent =
    students.length > 0
      ? [...students].sort(
          (a, b) =>
            Number(
              b.averageScore || 0
            ) -
            Number(
              a.averageScore || 0
            )
        )[0]
      : null;


  const studentsNeedingHelp =
    students.filter(
      (student) =>
        Number(
          student.averageScore || 0
        ) < 50
    ).length;


  const getScoreClass =
    (score) => {

      const value =
        Number(score || 0);

      if (value >= 75) {
        return "score-excellent";
      }

      if (value >= 50) {
        return "score-average";
      }

      return "score-low";
    };


  const getStatus =
    (score) => {

      const value =
        Number(score || 0);

      if (value >= 75) {
        return "Excellent";
      }

      if (value >= 50) {
        return "Good";
      }

      return "Needs Improvement";
    };


  if (loading) {
    return <Loader />;
  }


  if (error) {
    return (
      <div className="performance-page">

        <div className="performance-error">

          <div className="performance-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Performance
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="performance-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="performance-header">

        <div>

          <span className="performance-eyebrow">
            TEACHER ANALYTICS
          </span>

          <h1>
            Student Performance
          </h1>

          <p>
            Monitor student progress,
            exam participation and
            academic performance.
          </p>

        </div>


        <div className="performance-header-badge">
          📊 Performance Overview
        </div>

      </div>


      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <div className="performance-stats">

        <div className="performance-stat-card">

          <div className="stat-card-top">

            <div className="stat-icon students-icon">
              👨‍🎓
            </div>

            <span className="stat-trend">
              Active
            </span>

          </div>

          <span className="stat-label">
            Total Students
          </span>

          <strong className="stat-value">
            {totalStudents}
          </strong>

          <p className="stat-description">
            Students connected with you
          </p>

        </div>


        <div className="performance-stat-card">

          <div className="stat-card-top">

            <div className="stat-icon exams-icon">
              📝
            </div>

            <span className="stat-trend">
              Created
            </span>

          </div>

          <span className="stat-label">
            Total Exams
          </span>

          <strong className="stat-value">
            {totalExams}
          </strong>

          <p className="stat-description">
            Exams available to students
          </p>

        </div>


        <div className="performance-stat-card">

          <div className="stat-card-top">

            <div className="stat-icon completed-icon">
              ✅
            </div>

            <span className="stat-trend">
              {completionRate}%
            </span>

          </div>

          <span className="stat-label">
            Completed Exams
          </span>

          <strong className="stat-value">
            {completedExams}
          </strong>

          <p className="stat-description">
            Overall completion rate
          </p>

        </div>


        <div className="performance-stat-card">

          <div className="stat-card-top">

            <div className="stat-icon score-icon">
              🎯
            </div>

            <span
              className={`score-mini-badge ${getScoreClass(
                averageScore
              )}`}
            >
              {averageScore >= 75
                ? "Excellent"
                : averageScore >= 50
                ? "Good"
                : "Low"}
            </span>

          </div>

          <span className="stat-label">
            Average Score
          </span>

          <strong className="stat-value">
            {averageScore}%
          </strong>

          <div className="stat-progress">

            <div
              className="stat-progress-fill"
              style={{
                width: `${Math.min(
                  averageScore,
                  100
                )}%`
              }}
            />

          </div>

        </div>

      </div>


      {/* =====================================
          ANALYTICS ROW
      ====================================== */}

      <div className="performance-analytics">

        {/* Average Score */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>

              <span>
                CLASS PERFORMANCE
              </span>

              <h2>
                Average Score
              </h2>

            </div>

            <div className="analytics-icon">
              📈
            </div>

          </div>


          <div className="score-overview">

            <strong>
              {averageScore}%
            </strong>

            <span>
              Overall average
            </span>

          </div>


          <div className="large-progress">

            <div
              className="large-progress-fill"
              style={{
                width: `${Math.min(
                  averageScore,
                  100
                )}%`
              }}
            />

          </div>


          <div className="progress-scale">

            <span>
              0%
            </span>

            <span>
              50%
            </span>

            <span>
              100%
            </span>

          </div>

        </div>


        {/* Completion */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>

              <span>
                EXAM ACTIVITY
              </span>

              <h2>
                Completion Rate
              </h2>

            </div>

            <div className="analytics-icon">
              🎯
            </div>

          </div>


          <div className="completion-content">

            <div
              className="completion-circle"
              style={{
                "--completion":
                  `${completionRate}%`
              }}
            >

              <div>
                <strong>
                  {completionRate}%
                </strong>

                <span>
                  Completed
                </span>
              </div>

            </div>


            <div className="completion-details">

              <div>
                <span>
                  Completed
                </span>

                <strong>
                  {completedExams}
                </strong>
              </div>


              <div>
                <span>
                  Total Exams
                </span>

                <strong>
                  {totalExams}
                </strong>
              </div>

            </div>

          </div>

        </div>


        {/* Top Student */}

        <div className="analytics-card">

          <div className="analytics-card-header">

            <div>

              <span>
                TOP PERFORMER
              </span>

              <h2>
                Best Student
              </h2>

            </div>

            <div className="analytics-icon">
              🏆
            </div>

          </div>


          {topStudent ? (

            <div className="top-student">

              <div className="top-student-avatar">

                {topStudent.name
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>


              <div className="top-student-info">

                <strong>
                  {topStudent.name}
                </strong>

                <span>
                  {topStudent.email}
                </span>

              </div>


              <div className="top-student-score">

                <strong>
                  {topStudent.averageScore ||
                    0}%
                </strong>

                <span>
                  Average
                </span>

              </div>

            </div>

          ) : (

            <div className="analytics-empty">
              No student data available.
            </div>

          )}

        </div>

      </div>


      {/* =====================================
          ATTENTION BANNER
      ====================================== */}

      {studentsNeedingHelp > 0 && (

        <div className="performance-alert">

          <div className="alert-icon">
            ⚠️
          </div>

          <div>

            <strong>
              Students Need Attention
            </strong>

            <p>
              {studentsNeedingHelp}{" "}
              {studentsNeedingHelp === 1
                ? "student has"
                : "students have"}{" "}
              an average score below 50%.
              Consider providing additional
              learning support.
            </p>

          </div>

        </div>

      )}


      {/* =====================================
          STUDENT PERFORMANCE
      ====================================== */}

      <div className="student-performance-card">

        <div className="student-performance-header">

          <div>

            <span>
              DETAILED ANALYTICS
            </span>

            <h2>
              Student Performance
            </h2>

            <p>
              Review individual student
              academic progress.
            </p>

          </div>


          <div className="student-count-badge">
            {students.length}{" "}
            {students.length === 1
              ? "Student"
              : "Students"}
          </div>

        </div>


        {/* Filters */}

        <div className="performance-toolbar">

          <div className="performance-search">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search student by name or email..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>


          <div className="performance-filters">

            <button
              className={
                filter === "all"
                  ? "filter-active"
                  : ""
              }
              onClick={() =>
                setFilter("all")
              }
            >
              All
            </button>

            <button
              className={
                filter === "good"
                  ? "filter-active"
                  : ""
              }
              onClick={() =>
                setFilter("good")
              }
            >
              Excellent
            </button>

            <button
              className={
                filter === "average"
                  ? "filter-active"
                  : ""
              }
              onClick={() =>
                setFilter("average")
              }
            >
              Average
            </button>

            <button
              className={
                filter === "low"
                  ? "filter-active"
                  : ""
              }
              onClick={() =>
                setFilter("low")
              }
            >
              Needs Help
            </button>

          </div>

        </div>


        {/* Table */}

        {filteredStudents.length === 0 ? (

          <div className="performance-empty">

            <div>
              🔍
            </div>

            <h3>
              No Students Found
            </h3>

            <p>
              Try changing your search or
              performance filter.
            </p>

          </div>

        ) : (

          <div className="performance-table-wrapper">

            <table className="performance-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Exams
                  </th>

                  <th>
                    Average Score
                  </th>

                  <th>
                    Progress
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredStudents.map(
                  (student) => {

                    const score =
                      Number(
                        student.averageScore ||
                        0
                      );


                    return (

                      <tr
                        key={student._id}
                      >

                        <td>

                          <div className="student-cell">

                            <div className="student-table-avatar">

                              {student.name
                                ?.charAt(0)
                                ?.toUpperCase()}

                            </div>


                            <div>

                              <strong>
                                {student.name}
                              </strong>

                              <span>
                                {student.email}
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span className="exam-number">

                            {student.totalExams ||
                              0}

                          </span>

                        </td>


                        <td>

                          <div className="score-cell">

                            <strong
                              className={getScoreClass(
                                score
                              )}
                            >
                              {score}%
                            </strong>

                          </div>

                        </td>


                        <td>

                          <div className="student-progress">

                            <div className="student-progress-track">

                              <div
                                className="student-progress-fill"
                                style={{
                                  width: `${Math.min(
                                    score,
                                    100
                                  )}%`
                                }}
                              />

                            </div>

                            <span>
                              {score}%
                            </span>

                          </div>

                        </td>


                        <td>

                          <span
                            className={`performance-status ${getScoreClass(
                              score
                            )}`}
                          >

                            <span className="status-dot" />

                            {getStatus(
                              score
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

export default Performance;