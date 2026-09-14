import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ConnectionRequests.css";

function ConnectionRequests({ onAccepted }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/connections/requests"
      );

      console.log(
        "CONNECTION REQUESTS:",
        response.data
      );

      setRequests(
        response.data.requests || []
      );

    } catch (error) {
      console.error(
        "GET CONNECTION REQUESTS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load connection requests"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ACCEPT
  const handleAccept = async (connectionId) => {
    try {
      setActionLoading(connectionId);
      setError("");

      console.log(
        "ACCEPTING CONNECTION:",
        connectionId
      );

      await api.patch(
        `/connections/${connectionId}/accept`
      );

      setRequests((prevRequests) =>
        prevRequests.filter(
          (request) =>
            request._id !== connectionId
        )
      );

      if (onAccepted) {
        await onAccepted();
      }

    } catch (error) {
      console.error(
        "ACCEPT CONNECTION ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to accept connection"
      );

    } finally {
      setActionLoading(null);
    }
  };

  // REJECT
  const handleReject = async (connectionId) => {
    try {
      setActionLoading(connectionId);
      setError("");

      await api.patch(
        `/connections/${connectionId}/reject`
      );

      setRequests((prevRequests) =>
        prevRequests.filter(
          (request) =>
            request._id !== connectionId
        )
      );

    } catch (error) {
      console.error(
        "REJECT CONNECTION ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to reject connection"
      );

    } finally {
      setActionLoading(null);
    }
  };

  // LOADING
  if (loading) {
    return (
      <section className="connection-requests">

        <div className="connection-header">
          <div>
            <span className="connection-eyebrow">
              STUDENT CONNECTIONS
            </span>

            <h2>
              Connection Requests
            </h2>

            <p>
              Manage students who want to connect
              with you.
            </p>
          </div>
        </div>

        <div className="connection-loading">

          <div className="connection-spinner"></div>

          <p>
            Loading connection requests...
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="connection-requests">

      {/* HEADER */}
      <div className="connection-header">

        <div>
          <span className="connection-eyebrow">
            STUDENT CONNECTIONS
          </span>

          <h2>
            Connection Requests
          </h2>

          <p>
            Review and manage students who want
            to join your learning network.
          </p>
        </div>

        <div className="request-count">
          <span>
            {requests.length}
          </span>

          <small>
            Pending
          </small>
        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="connection-error">
          <span>!</span>
          <p>{error}</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {requests.length === 0 ? (

        <div className="connection-empty">

          <div className="empty-icon">
            ✓
          </div>

          <h3>
            All caught up!
          </h3>

          <p>
            There are no pending connection requests
            at the moment.
          </p>

        </div>

      ) : (

        /* REQUEST LIST */
        <div className="connection-list">

          {requests.map((request) => {

            const isProcessing =
              actionLoading === request._id;

            return (
              <div
                key={request._id}
                className="connection-card"
              >

                {/* STUDENT INFO */}
                <div className="student-info">

                  <div className="student-avatar">

                    {request.student?.profileImage ? (
                      <img
                        src={
                          request.student.profileImage
                        }
                        alt={
                          request.student.name ||
                          "Student"
                        }
                      />
                    ) : (
                      <span>
                        {request.student?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "S"}
                      </span>
                    )}

                  </div>

                  <div className="student-details">

                    <h3>
                      {request.student?.name ||
                        "Unknown Student"}
                    </h3>

                    <p>
                      {request.student?.email ||
                        "No email available"}
                    </p>

                    <span className="pending-badge">
                      Pending Request
                    </span>

                  </div>

                </div>

                {/* STATUS */}
                <div className="connection-status">

                  <span className="status-dot"></span>

                  <span>
                    {request.status}
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="connection-actions">

                  <button
                    className="accept-button"
                    onClick={() =>
                      handleAccept(
                        request._id
                      )
                    }
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="button-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        Accept
                      </>
                    )}
                  </button>

                  <button
                    className="reject-button"
                    onClick={() =>
                      handleReject(
                        request._id
                      )
                    }
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <span>×</span>
                        Reject
                      </>
                    )}
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default ConnectionRequests;