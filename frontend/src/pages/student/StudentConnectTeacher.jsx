import { useState } from "react";

import api from "../../services/api";

import "./StudentConnectTeacher.css";

function StudentConnectTeacher() {
  const [code, setCode] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!/^\d{6}$/.test(code)) {
      setError(
        "Please enter a valid 6-digit connection code"
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/connections/connect",
          {
            code
          }
        );

      setMessage(
        response.data.message ||
        "Connection request sent successfully"
      );

      setCode("");

    } catch (error) {
      console.error(
        "CONNECT TEACHER ERROR:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to send connection request"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="connect-teacher-card">

      {/* HEADER */}

      <div className="connect-teacher-header">

        <div className="connect-teacher-icon">
          👨‍🏫
        </div>

        <div>
          <h2>
            Connect with a Teacher
          </h2>

          <p>
            Enter your teacher's 6-digit
            connection code.
          </p>
        </div>

      </div>


      {/* FORM */}

      <form
        className="connect-teacher-form"
        onSubmit={handleSubmit}
      >

        <div className="connection-input-wrapper">

          <label>
            Connection Code
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            placeholder="Enter 6-digit code"
            maxLength="6"
            inputMode="numeric"
          />

          <span className="connection-code-hint">
            Enter the code provided by your teacher
          </span>

        </div>


        <button
          type="submit"
          className="connect-teacher-btn"
          disabled={
            loading ||
            code.length !== 6
          }
        >
          {loading
            ? "Sending..."
            : "Send Request"}

          {!loading && (
            <span>
              →
            </span>
          )}
        </button>

      </form>


      {/* SUCCESS */}

      {message && (
        <div className="connect-success-message">
          <span>✓</span>

          <p>
            {message}
          </p>
        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="connect-error-message">
          <span>!</span>

          <p>
            {error}
          </p>
        </div>
      )}

    </div>
  );
}

export default StudentConnectTeacher;