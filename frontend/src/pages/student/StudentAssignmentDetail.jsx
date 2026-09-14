import {
  useEffect,
  useState
} from "react";
import "./StudentAssignmentDetail.css";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../../services/api";
import Loader from "../../components/Loader";

function StudentAssignmentDetail() {

  const {
    assignmentId
  } = useParams();

  const navigate =
    useNavigate();


  const [
    assignment,
    setAssignment
  ] = useState(null);

  const [
    submission,
    setSubmission
  ] = useState(null);

  const [
    answer,
    setAnswer
  ] = useState("");

  const [
    fileUrl,
    setFileUrl
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [
    success,
    setSuccess
  ] = useState("");


  useEffect(() => {

    const fetchAssignment =
      async () => {

        try {

          const assignmentResponse =
            await api.get(
              "/assignments"
            );


          const foundAssignment =
            assignmentResponse.data.assignments?.find(
              (item) =>
                String(item._id) ===
                String(assignmentId)
            );


          if (!foundAssignment) {

            setError(
              "Assignment not found"
            );

            return;

          }


          setAssignment(
            foundAssignment
          );


          try {

            const submissionResponse =
              await api.get(
                `/assignment-submissions/student/${assignmentId}`
              );


            setSubmission(
              submissionResponse.data.submission
            );

          } catch (submissionError) {

            if (
              submissionError.response?.status !==
              404
            ) {
              throw submissionError;
            }

          }

        } catch (error) {

          console.error(
            "FETCH ASSIGNMENT ERROR:",
            error
          );

          setError(
            error.response?.data?.message ||
            "Failed to load assignment"
          );

        } finally {

          setLoading(false);

        }

      };


    fetchAssignment();

  }, [assignmentId]);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      if (
        !answer.trim() &&
        !fileUrl.trim()
      ) {

        setError(
          "Please write an answer or provide a file URL"
        );

        return;

      }


      try {

        setSubmitting(true);


        const response =
          await api.post(
            "/assignment-submissions",
            {
              assignmentId,
              answer,
              fileUrl
            }
          );


        setSubmission(
          response.data.submission
        );


        setSuccess(
          "Assignment submitted successfully"
        );


        setAnswer("");
        setFileUrl("");

      } catch (error) {

        console.error(
          "SUBMIT ASSIGNMENT ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to submit assignment"
        );

      } finally {

        setSubmitting(false);

      }

    };


  if (loading) {
    return <Loader />;
  }


  if (error && !assignment) {

    return (
      <div className="assignment-detail-page">

        <div className="assignment-error">
          {error}
        </div>

        <button
          onClick={() =>
            navigate(
              "/student/assignments"
            )
          }
        >
          Back to Assignments
        </button>

      </div>
    );

  }


  const dueDate =
    new Date(
      assignment.dueDate
    );


  const isGraded =
    submission?.status ===
    "graded";


  const isSubmitted =
    Boolean(submission);


  return (

    <div className="assignment-detail-page">

      <button
        className="back-btn"
        onClick={() =>
          navigate(
            "/student/assignments"
          )
        }
      >
        ← Back to Assignments
      </button>


      <div className="assignment-detail-card">

        <div className="assignment-detail-header">

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
                : "assignment-active"
            }
          >

            {isGraded
              ? "Graded"
              : isSubmitted
              ? "Submitted"
              : "Not Submitted"}

          </span>

        </div>


        <h1>
          {assignment.title}
        </h1>


        <div className="assignment-due-date">

          📅

          <span>
            Due Date
          </span>

          <strong>
            {dueDate.toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric"
              }
            )}
          </strong>

        </div>


        <div className="assignment-description">

          <h2>
            Assignment
          </h2>

          <p>
            {assignment.description}
          </p>

        </div>


        {error && (
          <div className="assignment-error">
            {error}
          </div>
        )}


        {success && (
          <div className="assignment-success">
            {success}
          </div>
        )}


        {isGraded ? (

          <div className="graded-result">

            <h2>
              Your Result
            </h2>

            <div className="marks-box">

              <span>
                Marks
              </span>

              <strong>
                {submission.marks}
              </strong>

            </div>


            {submission.feedback && (

              <div className="feedback-box">

                <h3>
                  Teacher Feedback
                </h3>

                <p>
                  {submission.feedback}
                </p>

              </div>

            )}


            {submission.answer && (

              <div className="submitted-answer">

                <h3>
                  Your Answer
                </h3>

                <p>
                  {submission.answer}
                </p>

              </div>

            )}

          </div>

        ) : isSubmitted ? (

          <div className="submission-success">

            <div className="submission-icon">
              ✅
            </div>

            <h2>
              Assignment Submitted
            </h2>

            <p>
              Your assignment has been
              submitted successfully.
            </p>

            <p>
              Your teacher will review it
              and provide marks and feedback.
            </p>

            {submission.answer && (

              <div className="submitted-answer">

                <h3>
                  Your Answer
                </h3>

                <p>
                  {submission.answer}
                </p>

              </div>

            )}

          </div>

        ) : (

          <form
            className="assignment-submit-form"
            onSubmit={handleSubmit}
          >

            <h2>
              Submit Your Assignment
            </h2>


            <label>
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(event) =>
                setAnswer(
                  event.target.value
                )
              }
              placeholder="Write your answer here..."
              rows={10}
            />


            <label>
              File URL
            </label>

            <input
              type="url"
              value={fileUrl}
              onChange={(event) =>
                setFileUrl(
                  event.target.value
                )
              }
              placeholder="Paste your uploaded file URL here"
            />


            <p className="submission-note">
              You can submit either an answer,
              a file URL, or both.
            </p>


            <button
              type="submit"
              disabled={submitting}
            >

              {submitting
                ? "Submitting..."
                : "Submit Assignment"}

            </button>

          </form>

        )}

      </div>

    </div>

  );
}

export default StudentAssignmentDetail;