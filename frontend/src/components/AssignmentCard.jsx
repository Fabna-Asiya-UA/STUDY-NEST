import { Link } from "react-router-dom";
import "./AssignmentCard.css";

function AssignmentCard({ assignment }) {

  const dueDate = new Date(
    assignment.dueDate
  );

  const formattedDate =
    dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  return (
    <div className="assignment-card">

      {/* Top Section */}
      <div className="assignment-card-top">

        <div className="assignment-icon">
          📝
        </div>

        <span className="assignment-badge">
          Assignment
        </span>

      </div>


      {/* Content */}
      <div className="assignment-card-content">

        <h3>
          {assignment.title}
        </h3>

        <p className="assignment-description">
          {assignment.description}
        </p>

      </div>


      {/* Due Date */}
      <div className="assignment-due-date">

        <div className="due-icon">
          📅
        </div>

        <div>
          <span className="due-label">
            Due Date
          </span>

          <strong>
            {formattedDate}
          </strong>
        </div>

      </div>


      {/* Action */}
      <Link
        to={`/student/assignments/${assignment._id}`}
        className="assignment-view-btn"
      >
        <span>
          View Assignment
        </span>

        <span className="assignment-arrow">
          →
        </span>
      </Link>

    </div>
  );
}

export default AssignmentCard;