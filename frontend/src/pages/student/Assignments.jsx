import "./Assignments.css";
import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../../services/api";
import Loader from "../../components/Loader";

function StudentAssignments() {

  const [
    assignments,
    setAssignments
  ] = useState([]);

  const [
    submissions,
    setSubmissions
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const navigate =
    useNavigate();


  useEffect(() => {

    const fetchData = async () => {

      try {

        const [
          assignmentResponse,
          submissionResponse
        ] = await Promise.all([
          api.get("/assignments"),
          api.get(
            "/assignment-submissions/student"
          )
        ]);


        setAssignments(
          assignmentResponse.data.assignments ||
          []
        );


        setSubmissions(
          submissionResponse.data.submissions ||
          []
        );

      } catch (error) {

        console.error(
          "FETCH ASSIGNMENTS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load assignments"
        );

      } finally {

        setLoading(false);

      }
    };


    fetchData();

  }, []);


  const getSubmission =
    (assignmentId) => {

      return submissions.find(
        (submission) =>
          String(
            submission.assignment?._id
          ) ===
          String(assignmentId)
      );
    };


  if (loading) {
    return <Loader />;
  }


  return (
    <div className="assignments-page">

      <div className="assignments-header">

        <div className="assignments-heading">

          <div className="assignments-icon">
            📝
          </div>

          <div>

            <h1>
              My Assignments
            </h1>

            <p>
              View and complete assignments
              given by your teacher.
            </p>

          </div>

        </div>

      </div>


      {error && (
        <div className="assignment-error">
          {error}
        </div>
      )}


      <div className="assignment-summary">

        <div className="summary-icon">
          📝
        </div>

        <div>

          <span className="summary-label">
            Total Assignments
          </span>

          <strong className="summary-value">
            {assignments.length}
          </strong>

        </div>

      </div>


      {assignments.length === 0 ? (

        <div className="assignments-empty">

          <div className="empty-icon">
            📝
          </div>

          <h2>
            No Assignments Yet
          </h2>

          <p>
            Your teacher has not assigned
            any assignments yet.
          </p>

        </div>

      ) : (

        <div className="assignments-section">

          <div className="section-header">

            <div>

              <h2>
                Assigned Assignments
              </h2>

              <p>
                Complete your assignments
                before the due date.
              </p>

            </div>

            <span className="assignment-count">

              {assignments.length}{" "}

              {assignments.length === 1
                ? "Assignment"
                : "Assignments"}

            </span>

          </div>


          <div className="assignments-grid">

            {assignments.map(
              (assignment) => {

                const dueDate =
                  new Date(
                    assignment.dueDate
                  );


                const submission =
                  getSubmission(
                    assignment._id
                  );


                const isGraded =
                  submission?.status ===
                  "graded";


                const isSubmitted =
                  Boolean(submission);


                const isOverdue =
                  dueDate < new Date() &&
                  !isSubmitted;


                return (

                  <div
                    className="assignment-card"
                    key={assignment._id}
                  >

                    <div className="assignment-card-top">

                      <span className="assignment-subject">

                        {assignment.subject ||
                          "General"}

                      </span>


                      <span
                        className={
                          isGraded
                            ? "assignment-graded"
                            : isSubmitted
                            ? "assignment-submitted"
                            : isOverdue
                            ? "assignment-overdue"
                            : "assignment-active"
                        }
                      >

                        {isGraded
                          ? "Graded"
                          : isSubmitted
                          ? "Submitted"
                          : isOverdue
                          ? "Overdue"
                          : "Not Submitted"}

                      </span>

                    </div>


                    <h3>
                      {assignment.title}
                    </h3>


                    <p>
                      {assignment.description}
                    </p>


                    <div className="assignment-card-info">

                      <span>
                        📅 Due Date
                      </span>

                      <strong>
                        {dueDate.toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          }
                        )}
                      </strong>

                    </div>


                    {isGraded && (
                      <div className="assignment-result">

                        <strong>
                          Marks:{" "}
                          {submission.marks}
                        </strong>

                        {submission.feedback && (
                          <p>
                            {submission.feedback}
                          </p>
                        )}

                      </div>
                    )}


                    <button
                      className="assignment-action-btn"
                      onClick={() =>
                        navigate(
                          `/student/assignments/${assignment._id}`
                        )
                      }
                    >

                      {isGraded
                        ? "View Result"
                        : isSubmitted
                        ? "View Submission"
                        : "View & Submit"}

                    </button>

                  </div>

                );

              }
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default StudentAssignments;