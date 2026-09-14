import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../../services/api";
import Loader from "../../components/Loader";

import "./AssignmentSubmissions.css";

function AssignmentSubmissions() {
  const { assignmentId } = useParams();

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchSubmissions =
      async () => {
        try {
          const response =
            await api.get(
              `/assignment-submissions/teacher/assignment/${assignmentId}`
            );

          setSubmissions(
            response.data.submissions || []
          );
        } catch (error) {
          console.error(
            "FETCH SUBMISSIONS ERROR:",
            error
          );

          setError(
            error.response?.data?.message ||
            "Failed to load submissions"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchSubmissions();
  }, [assignmentId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="assignment-submissions-page">

      {/* BACK BUTTON */}

      <button
        type="button"
        className="submissions-back-btn"
        onClick={() =>
          navigate(
            "/teacher/assignments"
          )
        }
      >
        <span>←</span>
        Back to Assignments
      </button>


      {/* HEADER */}

      <div className="submissions-header">

        <div className="submissions-header-icon">
          📝
        </div>

        <div>
          <h1>
            Assignment Submissions
          </h1>

          <p>
            Review and grade student submissions.
          </p>
        </div>

      </div>


      {/* SUMMARY */}

      <div className="submissions-summary">

        <div className="submission-summary-icon">
          👥
        </div>

        <div>
          <span>
            Total Submissions
          </span>

          <strong>
            {submissions.length}
          </strong>
        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="submissions-error">
          <span>!</span>

          <p>
            {error}
          </p>
        </div>
      )}


      {/* EMPTY */}

      {submissions.length === 0 ? (

        <div className="submissions-empty">

          <div className="submissions-empty-icon">
            📭
          </div>

          <h2>
            No Submissions Yet
          </h2>

          <p>
            No students have submitted
            this assignment yet.
          </p>

        </div>

      ) : (

        <div className="submissions-list">

          {submissions.map(
            (submission) => (

              <SubmissionCard
                key={submission._id}
                submission={submission}
                onUpdated={(
                  updatedSubmission
                ) => {

                  setSubmissions(
                    (previous) =>
                      previous.map(
                        (item) =>
                          item._id ===
                          updatedSubmission._id
                            ? updatedSubmission
                            : item
                      )
                  );

                }}
              />

            )
          )}

        </div>

      )}

    </div>
  );
}


function SubmissionCard({
  submission,
  onUpdated
}) {
  const [
    marks,
    setMarks
  ] = useState(
    submission.marks ?? ""
  );

  const [
    feedback,
    setFeedback
  ] = useState(
    submission.feedback || ""
  );

  const [
    grading,
    setGrading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");


  const handleGrade =
    async () => {

      setError("");

      if (
        marks === "" ||
        Number(marks) < 0
      ) {
        setError(
          "Please enter valid marks"
        );

        return;
      }

      try {
        setGrading(true);

        const response =
          await api.patch(
            `/assignment-submissions/${submission._id}/grade`,
            {
              marks,
              feedback
            }
          );

        onUpdated(
          response.data.submission
        );

      } catch (error) {
        console.error(
          "GRADE SUBMISSION ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to grade submission"
        );

      } finally {
        setGrading(false);
      }
    };


  return (
    <div className="submission-card">

      {/* STUDENT */}

      <div className="submission-student">

        <div className="student-avatar">

          {submission.student?.name
            ?.charAt(0)
            ?.toUpperCase()}

        </div>

        <div className="student-details">

          <h3>
            {submission.student?.name ||
              "Unknown Student"}
          </h3>

          <p>
            {submission.student?.email}
          </p>

        </div>

        <span
          className={
            submission.status === "graded"
              ? "submission-status graded"
              : "submission-status submitted"
          }
        >
          {submission.status ===
          "graded"
            ? "Graded"
            : "Submitted"}
        </span>

      </div>


      {/* DATE */}

      <div className="submission-date">

        <span>
          🕒
        </span>

        Submitted:

        {" "}

        {new Date(
          submission.submittedAt
        ).toLocaleString(
          "en-IN"
        )}

      </div>


      {/* ANSWER */}

      {submission.answer && (

        <div className="student-answer">

          <div className="submission-content-title">

            <span>💬</span>

            <h4>
              Student Answer
            </h4>

          </div>

          <p>
            {submission.answer}
          </p>

        </div>

      )}


      {/* FILE */}

      {submission.fileUrl && (

        <div className="student-file">

          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>📎</span>
            View Submitted File
            <span>↗</span>
          </a>

        </div>

      )}


      {/* GRADING */}

      <div className="grading-section">

        <div className="grading-heading">

          <div className="grading-icon">
            ✓
          </div>

          <div>
            <h4>
              Grade Submission
            </h4>

            <p>
              Provide marks and feedback
              for the student.
            </p>
          </div>

        </div>


        {error && (
          <div className="grading-error">
            <span>!</span>

            <p>
              {error}
            </p>
          </div>
        )}


        <div className="grading-field">

          <label>
            Marks
          </label>

          <input
            type="number"
            min="0"
            value={marks}
            onChange={(event) =>
              setMarks(
                event.target.value
              )
            }
            placeholder="Enter marks"
          />

        </div>


        <div className="grading-field">

          <label>
            Feedback
          </label>

          <textarea
            value={feedback}
            onChange={(event) =>
              setFeedback(
                event.target.value
              )
            }
            placeholder="Write feedback for the student..."
            rows={5}
          />

        </div>


        <button
          type="button"
          className="grade-submit-btn"
          onClick={handleGrade}
          disabled={grading}
        >

          {grading
            ? "Saving..."
            : submission.status ===
              "graded"
            ? "Update Grade"
            : "Grade Assignment"}

          {!grading && (
            <span>→</span>
          )}

        </button>

      </div>

    </div>
  );
}


export default AssignmentSubmissions;