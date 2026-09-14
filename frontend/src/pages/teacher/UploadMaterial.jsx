import { useState } from "react";
import api from "../../services/api";


function UploadMaterial() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    fileUrl: "",
    videoUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.title.trim()) {
      setError("Please enter a material title");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/materials",
        formData
      );

      setMessage(
        response.data.message ||
          "Material uploaded successfully"
      );

      setFormData({
        title: "",
        description: "",
        subject: "",
        fileUrl: "",
        videoUrl: ""
      });
    } catch (error) {
      console.error(
        "UPLOAD MATERIAL ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to upload material"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-material-page">

      <div className="upload-material-header">
        <h1>Upload Material</h1>

        <p>
          Add study materials for your
          connected students.
        </p>
      </div>

      <div className="upload-material-card">

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>
              Material Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter material title"
            />
          </div>

          <div className="form-group">
            <label>
              Subject
            </label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Example: Python"
            />
          </div>

          <div className="form-group">
            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a short description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>
              File URL
            </label>

            <input
              type="url"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/file.pdf"
            />

            <small>
              Enter the URL of the PDF or document.
            </small>
          </div>

          <div className="form-group">
            <label>
              Video URL
            </label>

            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
            />

            <small>
              Optional. Add a video link if needed.
            </small>
          </div>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="upload-button"
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload Material"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default UploadMaterial;