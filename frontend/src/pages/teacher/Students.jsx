import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teachers/students");

      setStudents(response.data.students || []);
    } catch (error) {
      console.error(
        "GET STUDENTS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Search students
  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(value) ||
      student.email?.toLowerCase().includes(value)
    );
  });

  // Loading
  if (loading) {
    return (
      <div className="students-page">

        <div className="students-heading">
          <div>
            <h1>Students</h1>
            <p>View and manage your connected students.</p>
          </div>
        </div>

        <div className="students-loading">
          <div className="loading-spinner"></div>
          <p>Loading students...</p>
        </div>

      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="students-page">

        <div className="students-heading">
          <div>
            <h1>Students</h1>
            <p>View and manage your connected students.</p>
          </div>
        </div>

        <div className="students-error">
          <h3>Unable to load students</h3>
          <p>{error}</p>

          <button onClick={loadStudents}>
            Try Again
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="students-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="students-heading">

        <div>
          <h1>Students</h1>

          <p>
            View and manage your connected students.
          </p>
        </div>

        <div className="students-total">
          <span>{students.length}</span>
          <p>Students</p>
        </div>

      </div>


      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="students-toolbar">

        <div className="student-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <button
          className="refresh-button"
          onClick={loadStudents}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {students.length === 0 ? (

        <div className="students-empty">

          <div className="empty-icon">
            👨‍🎓
          </div>

          <h2>
            No students connected
          </h2>

          <p>
            Students will appear here after
            you accept their connection requests.
          </p>

        </div>

      ) : filteredStudents.length === 0 ? (

        <div className="students-empty">

          <div className="empty-icon">
            🔍
          </div>

          <h2>
            No students found
          </h2>

          <p>
            Try searching with another name
            or email address.
          </p>

        </div>

      ) : (

        /* =====================================
            STUDENTS GRID
        ====================================== */

        <div className="students-grid">

          {filteredStudents.map((student) => (

            <div
              className="student-card"
              key={student._id}
            >

              {/* Student Header */}

              <div className="student-card-header">

                <div className="student-avatar">

                  {student.profileImage ? (

                    <img
                      src={student.profileImage}
                      alt={student.name}
                    />

                  ) : (

                    <span>
                      {student.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </span>

                  )}

                </div>

                <div className="student-status">
                  <span></span>
                  Connected
                </div>

              </div>


              {/* Student Information */}

              <div className="student-information">

                <h2>
                  {student.name}
                </h2>

                <p>
                  {student.email}
                </p>

              </div>


              {/* Student Details */}

              <div className="student-details">

                <div className="student-detail">

                  <span className="detail-label">
                    Role
                  </span>

                  <span className="detail-value">
                    {student.role || "Student"}
                  </span>

                </div>


                <div className="student-detail">

                  <span className="detail-label">
                    Status
                  </span>

                  <span className="detail-value connected">
                    Active
                  </span>

                </div>

              </div>


              {/* Card Footer */}

              <div className="student-card-footer">

               

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Students;