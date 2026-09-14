import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Materials.css";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/materials");

      setMaterials(response.data.materials || []);
    } catch (error) {
      console.error(
        "GET MATERIALS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load materials"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this material?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/materials/${id}`);

      setMaterials((currentMaterials) =>
        currentMaterials.filter(
          (material) => material._id !== id
        )
      );
    } catch (error) {
      console.error(
        "DELETE MATERIAL ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete material"
      );
    }
  };

  const subjects = [
    "All",
    ...new Set(
      materials
        .map((material) => material.subject)
        .filter(Boolean)
    )
  ];

  const filteredMaterials = materials.filter(
    (material) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        material.title
          ?.toLowerCase()
          .includes(searchText) ||
        material.description
          ?.toLowerCase()
          .includes(searchText) ||
        material.subject
          ?.toLowerCase()
          .includes(searchText);

      const matchesSubject =
        subjectFilter === "All" ||
        material.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    }
  );

  return (
    <div className="materials-page">

      <div className="materials-hero">

        <div className="materials-hero-content">

          <div className="materials-badge">
            <span>📚</span>
            Learning Resources
          </div>

          <h1>
            My Materials
          </h1>

          <p>
            Create, organize and manage study
            materials for your connected students.
          </p>

        </div>

        <Link
          to="/teacher/materials/upload"
          className="primary-upload-button"
        >
          <span>+</span>
          Upload Material
        </Link>

      </div>


      <div className="materials-stats">

        <div className="stat-card">

          <div className="stat-icon">
            📚
          </div>

          <div>
            <span className="stat-label">
              Total Materials
            </span>

            <strong>
              {materials.length}
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            📄
          </div>

          <div>
            <span className="stat-label">
              Files
            </span>

            <strong>
              {
                materials.filter(
                  (material) =>
                    material.fileUrl
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            ▶
          </div>

          <div>
            <span className="stat-label">
              Videos
            </span>

            <strong>
              {
                materials.filter(
                  (material) =>
                    material.videoUrl
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            📖
          </div>

          <div>
            <span className="stat-label">
              Subjects
            </span>

            <strong>
              {subjects.length - 1}
            </strong>
          </div>

        </div>

      </div>


      {!loading &&
        !error &&
        materials.length > 0 && (
          <div className="materials-toolbar">

            <div className="search-wrapper">

              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search materials..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              value={subjectFilter}
              onChange={(e) =>
                setSubjectFilter(
                  e.target.value
                )
              }
              className="subject-filter"
            >
              {subjects.map((subject) => (
                <option
                  key={subject}
                  value={subject}
                >
                  {subject}
                </option>
              ))}
            </select>

          </div>
        )}


      {loading && (
        <div className="materials-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading your materials...
          </p>

        </div>
      )}


      {error && (
        <div className="materials-error">

          <div className="error-icon">
            !
          </div>

          <div>
            <strong>
              Something went wrong
            </strong>

            <p>
              {error}
            </p>
          </div>

          <button
            onClick={loadMaterials}
            className="retry-button"
          >
            Try Again
          </button>

        </div>
      )}


      {!loading &&
        !error &&
        materials.length === 0 && (
          <div className="materials-empty">

            <div className="empty-icon">
              📚
            </div>

            <h2>
              No materials yet
            </h2>

            <p>
              Start building your learning
              library by uploading your first
              study material.
            </p>

            <Link
              to="/teacher/materials/upload"
              className="empty-upload-button"
            >
              + Upload Your First Material
            </Link>

          </div>
        )}


      {!loading &&
        !error &&
        materials.length > 0 &&
        filteredMaterials.length === 0 && (
          <div className="no-results">

            <div>
              🔍
            </div>

            <h3>
              No materials found
            </h3>

            <p>
              Try changing your search or
              subject filter.
            </p>

          </div>
        )}


      {!loading &&
        !error &&
        filteredMaterials.length > 0 && (
          <div className="materials-grid">

            {filteredMaterials.map(
              (material) => (
                <div
                  className="material-card"
                  key={material._id}
                >

                  <div className="material-card-header">

                    <div className="material-type-icon">
                      📚
                    </div>

                    <div className="material-menu">
                      <button
                        onClick={() =>
                          handleDelete(
                            material._id
                          )
                        }
                        title="Delete material"
                      >
                        ⋮
                      </button>
                    </div>

                  </div>


                  <div className="material-content">

                    {material.subject && (
                      <span className="material-subject">
                        {material.subject}
                      </span>
                    )}

                    <h3>
                      {material.title}
                    </h3>

                    <p>
                      {material.description ||
                        "No description provided for this material."}
                    </p>

                  </div>


                  <div className="material-meta">

                    <span>
                      📅{" "}
                      {new Date(
                        material.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }
                      )}
                    </span>

                    {material.fileUrl && (
                      <span>
                        📄 File
                      </span>
                    )}

                    {material.videoUrl && (
                      <span>
                        ▶ Video
                      </span>
                    )}

                  </div>


                  <div className="material-actions">

                    {material.fileUrl && (
                      <a
                        href={
                          material.fileUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="file-button"
                      >
                        <span>📄</span>
                        View File
                      </a>
                    )}

                    {material.videoUrl && (
                      <a
                        href={
                          material.videoUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="video-button"
                      >
                        <span>▶</span>
                        Watch Video
                      </a>
                    )}

                  </div>


                  <div className="material-card-footer">

                    <span>
                      Uploaded by you
                    </span>

                    <button
                      onClick={() =>
                        handleDelete(
                          material._id
                        )
                      }
                      className="delete-button"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}

export default Materials;
