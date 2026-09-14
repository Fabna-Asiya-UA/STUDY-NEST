import "./MaterialCard.css";

function MaterialCard({ material }) {

  return (
    <div className="material-card">

      {/* Header */}
      <div className="material-card-header">

        <div className="material-icon">
          📚
        </div>

        <span className="material-badge">
          Study Material
        </span>

      </div>


      {/* Content */}
      <div className="material-card-content">

        <h3>
          {material.title}
        </h3>

        {material.description && (
          <p>
            {material.description}
          </p>
        )}

      </div>


      {/* Teacher */}
      {material.teacher && (
        <div className="material-teacher">

          <div className="material-teacher-avatar">
            {material.teacher.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div className="material-teacher-info">

            <span>
              Shared by
            </span>

            <strong>
              {material.teacher.name}
            </strong>

          </div>

        </div>
      )}


      {/* Actions */}
      <div className="material-actions">

        {material.fileUrl && (
          <a
            href={material.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="material-view-btn"
          >
            <span>
              📄 View Material
            </span>

            <span className="material-arrow">
              →
            </span>
          </a>
        )}

        {material.videoUrl && (
          <a
            href={material.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="material-video-btn"
          >
            🎥 Watch Video
          </a>
        )}

      </div>

    </div>
  );
}

export default MaterialCard;