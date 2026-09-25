
import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");

      setUser(response.data.user || response.data);
    } catch (error) {
      console.error(
        "PROFILE ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h3>Unable to load profile</h3>
        <p>{error}</p>

        <button onClick={fetchProfile}>
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <p>User profile not found.</p>
      </div>
    );
  }

  const firstLetter =
    user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-page">

      {/* Profile Header */}
      <div className="profile-header">

        <div className="profile-cover"></div>

        <div className="profile-header-content">

          <div className="profile-avatar">
            {firstLetter}
          </div>

          <div className="profile-main-info">
            <h1>{user.name}</h1>

            <p>{user.email}</p>

            <span className="profile-role">
              {user.role}
            </span>
          </div>

        </div>

      </div>


      {/* Profile Content */}
      <div className="profile-content">

        {/* Personal Information */}
        <div className="profile-card">

          <div className="profile-card-header">
            <div>
              <h2>Personal Information</h2>
              <p>Your account details</p>
            </div>
          </div>

          <div className="profile-info-grid">

            <div className="profile-info-item">
              <span className="info-label">
                Full Name
              </span>

              <span className="info-value">
                {user.name || "Not available"}
              </span>
            </div>


            <div className="profile-info-item">
              <span className="info-label">
                Email
              </span>

              <span className="info-value">
                {user.email || "Not available"}
              </span>
            </div>


            <div className="profile-info-item">
              <span className="info-label">
                Role
              </span>

              <span className="info-value role-value">
                {user.role || "User"}
              </span>
            </div>


            <div className="profile-info-item">
              <span className="info-label">
                Account Status
              </span>

              <span className="status-badge">
                Active
              </span>
            </div>

          </div>

        </div>


        {/* Teacher Connection Code */}
        {user.role === "teacher" && (
          <div className="profile-card connection-card">

            <div className="connection-icon">
              🔗
            </div>

            <div className="connection-content">

              <h2>Student Connection Code</h2>

              <p>
                Share this code with your students
                so they can send you a connection
                request.
              </p>

              <div className="connection-code-box">

                <span>
                  {user.connectionCode ||
                    "No code available"}
                </span>

                {user.connectionCode && (
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        user.connectionCode
                      )
                    }
                  >
                    Copy
                  </button>
                )}

              </div>

            </div>

          </div>
        )}


        {/* Account Information */}
        <div className="profile-card">

          <div className="profile-card-header">
            <div>
              <h2>Account Information</h2>
              <p>StudyNest account details</p>
            </div>
          </div>

          <div className="account-details">

            <div className="account-detail-row">
              <span>Account Type</span>

              <strong>
                {user.role === "teacher"
                  ? "Teacher"
                  : user.role === "student"
                  ? "Student"
                  : "User"}
              </strong>
            </div>


            <div className="account-detail-row">
              <span>Account Status</span>

              <strong className="active-text">
                Active
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;

