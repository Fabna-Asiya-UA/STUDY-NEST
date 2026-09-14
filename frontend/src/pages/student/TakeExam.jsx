
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

import "./TakeExam.css";


function TakeExam() {

  // ========================================
  // URL PARAMETER
  // ========================================

  const { id } = useParams();

  const navigate = useNavigate();


  // ========================================
  // STATES
  // ========================================

  const [exam, setExam] = useState(null);

  const [answerFile, setAnswerFile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  // ========================================
  // FETCH EXAM
  // ========================================

  useEffect(() => {

    const fetchExam = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await api.get(`/exams/${id}`);

        console.log(
          "EXAM:",
          response.data
        );

        setExam(
          response.data.exam
        );

      } catch (error) {

        console.error(
          "FETCH EXAM ERROR:",
          error.response?.data ||
          error.message
        );

        setError(
          error.response?.data?.message ||
          "Failed to load exam"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchExam();

  }, [id]);


  // ========================================
  // HANDLE FILE CHANGE
  // ========================================

  const handleFileChange = (event) => {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    setAnswerFile(file);

    setError("");
    setMessage("");

  };


  // ========================================
  // DOWNLOAD QUESTION PAPER
  // ========================================

  const handleDownloadPaper = () => {

    if (!exam?.questionPaper) {

      setError(
        "Question paper is not available"
      );

      return;

    }

    window.open(
      exam.questionPaper,
      "_blank"
    );

  };


  // ========================================
  // SUBMIT EXAM
  // ========================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setMessage("");


    // ========================================
    // VALIDATE FILE
    // ========================================

    if (!answerFile) {

      setError(
        "Please upload your answer file"
      );

      return;

    }


    try {

      setSubmitting(true);


      // ========================================
      // CREATE FORM DATA
      // ========================================

      const formData =
        new FormData();


      /*
        IMPORTANT:

        This field name must match
        your backend:

        upload.single("answerFile")
      */

      formData.append(
        "answerFile",
        answerFile
      );


      // ========================================
      // SUBMIT ANSWER FILE
      // ========================================

      const response =
        await api.post(
          `/exams/${id}/submit`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );


      // ========================================
      // SUCCESS
      // ========================================

      setMessage(
        response.data.message ||
        "Exam submitted successfully"
      );


      setAnswerFile(null);


      // Reset file input

      event.target.reset();


      // ========================================
      // GO BACK AFTER SHORT DELAY
      // ========================================

      setTimeout(() => {

        navigate(
          "/student/exams"
        );

      }, 1500);


    } catch (error) {

      console.error(
        "SUBMIT EXAM ERROR:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to submit exam"
      );

    } finally {

      setSubmitting(false);

    }

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return <Loader />;

  }


  // ========================================
  // ERROR
  // ========================================

  if (error && !exam) {

    return (

      <div className="take-exam-page">

        <div className="exam-error">

          <h2>
            Unable to load exam
          </h2>

          <p>
            {error}
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate("/student/exams")
          }
        >
          Back to Exams
        </button>

      </div>

    );

  }


  // ========================================
  // EXAM NOT FOUND
  // ========================================

  if (!exam) {

    return (

      <div className="take-exam-page">

        <div className="exam-error">

          <h2>
            Exam not found
          </h2>

          <p>
            The requested exam could not
            be found.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate("/student/exams")
          }
        >
          Back to Exams
        </button>

      </div>

    );

  }


  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="take-exam-page">


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="take-exam-header">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/student/exams")
          }
        >
          ← Back to Exams
        </button>


        <div className="exam-header-content">

          <span className="exam-badge">
            Written Exam
          </span>

          <h1>
            {exam.title}
          </h1>

          <p>
            {exam.subject || "General"}
          </p>

        </div>

      </div>


      {/* ========================================
          ERROR MESSAGE
      ======================================== */}

      {error && (

        <div className="exam-error">

          {error}

        </div>

      )}


      {/* ========================================
          SUCCESS MESSAGE
      ======================================== */}

      {message && (

        <div className="exam-success">

          {message}

        </div>

      )}


      {/* ========================================
          EXAM DETAILS
      ======================================== */}

      <div className="exam-details-card">

        <h2>
          Exam Details
        </h2>


        <div className="exam-details-grid">


          {/* DATE */}

          <div className="exam-detail">

            <span className="detail-icon">
              📅
            </span>

            <div>

              <span>
                Exam Date
              </span>

              <strong>
                {exam.examDate
                  ? new Date(
                      exam.examDate
                    ).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )
                  : "Not specified"}
              </strong>

            </div>

          </div>


          {/* DURATION */}

          <div className="exam-detail">

            <span className="detail-icon">
              ⏱️
            </span>

            <div>

              <span>
                Duration
              </span>

              <strong>
                {exam.duration
                  ? `${exam.duration} minutes`
                  : "Not specified"}
              </strong>

            </div>

          </div>


          {/* SUBJECT */}

          <div className="exam-detail">

            <span className="detail-icon">
              📚
            </span>

            <div>

              <span>
                Subject
              </span>

              <strong>
                {exam.subject ||
                  "General"}
              </strong>

            </div>

          </div>


          {/* MARKS */}

          <div className="exam-detail">

            <span className="detail-icon">
              📝
            </span>

            <div>

              <span>
                Maximum Marks
              </span>

              <strong>
                {exam.totalMarks ||
                  "Not specified"}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ========================================
          DESCRIPTION
      ======================================== */}

      {exam.description && (

        <div className="exam-description-card">

          <h2>
            Instructions
          </h2>

          <p>
            {exam.description}
          </p>

        </div>

      )}


      {/* ========================================
          QUESTION PAPER
      ======================================== */}

      <div className="question-paper-card">

        <div className="section-heading">

          <div className="paper-icon">
            📄
          </div>

          <div>

            <h2>
              Question Paper
            </h2>

            <p>
              Download the question paper
              and complete the exam.
            </p>

          </div>

        </div>


        <button
          type="button"
          className="download-paper-btn"
          onClick={handleDownloadPaper}
        >
          📥 Download Question Paper
        </button>

      </div>


      {/* ========================================
          ANSWER UPLOAD
      ======================================== */}

      <form
        className="answer-upload-card"
        onSubmit={handleSubmit}
      >

        <div className="section-heading">

          <div className="upload-icon">
            📤
          </div>

          <div>

            <h2>
              Submit Your Answer
            </h2>

            <p>
              Upload your completed answer
              file below.
            </p>

          </div>

        </div>


        {/* FILE INPUT */}

        <label className="file-upload-area">

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          <span className="upload-file-icon">
            📎
          </span>

          <strong>
            Choose your answer file
          </strong>

          <small>
            PDF, DOC or DOCX
          </small>

        </label>


        {/* SELECTED FILE */}

        {answerFile && (

          <div className="selected-file">

            <span>
              📄
            </span>

            <div>

              <strong>
                {answerFile.name}
              </strong>

              <small>
                {(
                  answerFile.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </small>

            </div>

          </div>

        )}


        {/* SUBMIT */}

        <button
          type="submit"
          className="submit-exam-btn"
          disabled={submitting}
        >

          {submitting
            ? "Submitting..."
            : "Submit Exam"}

        </button>


        <p className="submission-note">
          Make sure you have uploaded the
          correct answer file before
          submitting.
        </p>

      </form>


    </div>

  );

}


export default TakeExam;

