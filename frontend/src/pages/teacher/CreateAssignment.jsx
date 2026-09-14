import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAssignment.css";
import api from "../../services/api";

function CreateAssignment() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] =
    useState(true);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // LOAD EXISTING ASSIGNMENTS
  // ========================================

  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);

      const response = await api.get(
        "/assignments"
      );

      setAssignments(
        response.data.assignments || []
      );
    } catch (error) {
      console.error(
        "LOAD ASSIGNMENTS ERROR:",
        error.response?.data ||
          error.message
      );
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // ========================================
  // DELETE ASSIGNMENT
  // ========================================

  const handleDeleteAssignment = async (
    assignmentId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/assignments/${assignmentId}`
      );

      setAssignments(
        (previousAssignments) =>
          previousAssignments.filter(
            (assignment) =>
              assignment._id !==
              assignmentId
          )
      );

      setSuccess(
        "Assignment deleted successfully!"
      );

      setError("");
    } catch (error) {
      console.error(
        "DELETE ASSIGNMENT ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete assignment."
      );
    }
  };

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value
      })
    );
  };

  // ========================================
  // CREATE ASSIGNMENT
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError(
        "Assignment title is required."
      );
      return;
    }

    if (!formData.subject.trim()) {
      setError(
        "Subject is required."
      );
      return;
    }

    if (!formData.description.trim()) {
      setError(
        "Description is required."
      );
      return;
    }

    if (!formData.dueDate) {
      setError(
        "Due date is required."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/assignments",
        {
          title:
            formData.title.trim(),

          subject:
            formData.subject.trim(),

          description:
            formData.description.trim(),

          dueDate:
            formData.dueDate
        }
      );

      console.log(
        "CREATE ASSIGNMENT:",
        response.data
      );

      setSuccess(
        "Assignment created successfully!"
      );

      setFormData({
        title: "",
        subject: "",
        description: "",
        dueDate: ""
      });

      // Refresh assignment list
      loadAssignments();

    } catch (error) {
      console.error(
        "CREATE ASSIGNMENT ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to create assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-assignment-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="assignment-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/teacher")
          }
        >
          ← Back to Dashboard
        </button>

        <div className="assignment-heading">

          <span className="assignment-icon">
            📝
          </span>

          <div>

            <h1>
              Assignments
            </h1>

            <p>
              Manage your assignments and
              create new ones for your students.
            </p>

          </div>

        </div>

      </div>


      {/* ========================================
          EXISTING ASSIGNMENTS
      ======================================== */}

      <div className="existing-assignments-section">

        <div className="existing-assignments-header">

          <div>

            <h2>
              Your Assignments
            </h2>

            <p>
              Assignments you have already
              created.
            </p>

          </div>

          <span className="assignment-count">
            {assignments.length}{" "}
            {assignments.length === 1
              ? "Assignment"
              : "Assignments"}
          </span>

        </div>


        {loadingAssignments ? (

          <div className="assignment-loading">
            Loading assignments...
          </div>

        ) : assignments.length === 0 ? (

          <div className="assignment-empty">

            <div className="assignment-empty-icon">
              📝
            </div>

            <h3>
              No assignments yet
            </h3>

            <p>
              Create your first assignment
              using the form below.
            </p>

          </div>

        ) : (

          <div className="existing-assignments-grid">

            {assignments.map(
              (assignment) => (

                <div
                  className="existing-assignment-card"
                  key={assignment._id}
                >

                  <div className="existing-assignment-top">

                    <span className="assignment-subject">
                      {assignment.subject ||
                        "General"}
                    </span>

                    <button
                      type="button"
                      className="delete-assignment-button"
                      onClick={() =>
                        handleDeleteAssignment(
                          assignment._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>


                  <h3>
                    {assignment.title}
                  </h3>


                  <p className="assignment-description">
                    {assignment.description}
                  </p>


                  <div className="assignment-card-info">

                    <span>
                      📅 Due:{" "}
                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }
                      )}
                    </span>

                    <span>
                      🕐{" "}
                      {new Date(
                        assignment.dueDate
                      ).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit"
                        }
                      )}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* ========================================
          CREATE ASSIGNMENT
      ======================================== */}

      <div className="assignment-form-card">

        <div className="form-card-header">

          <h2>
            Create New Assignment
          </h2>

          <p>
            Fill in the details below to
            create an assignment.
          </p>

        </div>


        {error && (

          <div className="assignment-message error">
            {error}
          </div>

        )}


        {success && (

          <div className="assignment-message success">
            {success}
          </div>

        )}


        <form
          onSubmit={handleSubmit}
          className="assignment-form"
        >

          <div className="form-group">

            <label>
              Assignment Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter assignment title"
              value={formData.title}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>
              Subject
            </label>

            <input
              type="text"
              name="subject"
              placeholder="e.g. Python, Mathematics, Science"
              value={formData.subject}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              rows="6"
              placeholder="Write the assignment instructions..."
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>
              Due Date
            </label>

            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="cancel-assignment-btn"
              onClick={() =>
                navigate("/teacher")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="create-assignment-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Assignment"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateAssignment;