import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../../services/api";

import "./CreateExam.css";

function CreateExam() {

  // ========================================
  // STATES
  // ========================================

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [examDate, setExamDate] = useState("");
  const [questionPaper, setQuestionPaper] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // ========================================
  // NAVIGATION
  // ========================================

  const navigate = useNavigate();


  // ========================================
  // LOAD EXAMS
  // ========================================

  const loadExams = async () => {

    try {

      const response =
        await api.get("/exams/teacher");

      console.log(
        "EXAMS:",
        response.data.exams
      );

    } catch (error) {

      console.error(
        "LOAD EXAMS ERROR:",
        error.response?.data ||
        error.message
      );

    }
  };


  // ========================================
  // HANDLE SUBMIT
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // ========================================
    // VALIDATION
    // ========================================

    if (!title.trim()) {

      setError(
        "Please enter an exam title"
      );

      return;
    }


    if (!subject.trim()) {

      setError(
        "Please enter a subject"
      );

      return;
    }


    if (!duration) {

      setError(
        "Please enter exam duration"
      );

      return;
    }


    if (!examDate) {

      setError(
        "Please select exam date"
      );

      return;
    }


    if (!questionPaper) {

      setError(
        "Please upload the question paper"
      );

      return;
    }


    try {

      setLoading(true);


      // ========================================
      // CREATE FORM DATA
      // ========================================

      const formData =
        new FormData();


      formData.append(
        "title",
        title.trim()
      );


      formData.append(
        "subject",
        subject.trim()
      );


      formData.append(
        "description",
        description.trim()
      );


      formData.append(
        "duration",
        duration
      );


      formData.append(
        "examDate",
        examDate
      );


      // MUST MATCH:
      // upload.single("questionPaper")

      formData.append(
        "questionPaper",
        questionPaper
      );


      // ========================================
      // SEND REQUEST
      // ========================================

      const response =
        await api.post(
          "/exams",
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
        "Exam created successfully"
      );


      // ========================================
      // RESET FORM
      // ========================================

      setTitle("");
      setSubject("");
      setDescription("");
      setDuration("");
      setExamDate("");
      setQuestionPaper(null);


      // Reset file input

      e.target.reset();


      // ========================================
      // REFRESH EXAMS
      // ========================================

      loadExams();


    } catch (error) {

      console.error(
        "CREATE EXAM ERROR:",
        error.response?.data ||
        error.message
      );


      setError(
        error.response?.data?.message ||
        "Failed to create exam"
      );


    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // JSX
  // ========================================

  return (
    <div className="create-exam-page">

      <h1>Create Exam</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Exam title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Duration in minutes"
          value={duration}
          onChange={(e) =>
            setDuration(e.target.value)
          }
        />

        <input
          type="datetime-local"
          value={examDate}
          onChange={(e) =>
            setExamDate(e.target.value)
          }
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setQuestionPaper(
              e.target.files[0]
            )
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating..."
            : "Create Exam"}
        </button>

      </form>


      {message && (
        <p>{message}</p>
      )}


      {error && (
        <p>{error}</p>
      )}

    </div>
  );
}


export default CreateExam;