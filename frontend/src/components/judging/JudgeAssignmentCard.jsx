import { Link } from "react-router-dom";

function JudgeAssignmentCard({ assignment }) {
  const project = assignment?.project;
  const judge = assignment?.judge;
  const track = assignment?.track;
  const event = assignment?.event;

  const getStatusClass = (status) => {
    switch (status) {
      case "assigned":
        return "assignment-status assigned";

      case "in_progress":
        return "assignment-status in-progress";

      case "completed":
        return "assignment-status completed";

      case "cancelled":
        return "assignment-status cancelled";

      default:
        return "assignment-status";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className="judge-assignment-card">

      <div className="assignment-card-header">
        <div>
          <h3>
            {project?.title || "Project Assignment"}
          </h3>

          <p className="assignment-event">
            {event?.title || "Event"}
          </p>
        </div>

        <span className={getStatusClass(assignment?.status)}>
          {formatStatus(assignment?.status)}
        </span>
      </div>

      <div className="assignment-card-body">

        {project?.team && (
          <div className="assignment-info">
            <strong>Team:</strong>

            <span>
              {typeof project.team === "object"
                ? project.team.name
                : project.team}
            </span>
          </div>
        )}

        {judge && (
          <div className="assignment-info">
            <strong>Judge:</strong>

            <span>
              {typeof judge === "object"
                ? judge.name || judge.email
                : judge}
            </span>
          </div>
        )}

        {track && (
          <div className="assignment-info">
            <strong>Track:</strong>

            <span>
              {typeof track === "object"
                ? track.name
                : track}
            </span>
          </div>
        )}

        {assignment?.assignedAt && (
          <div className="assignment-info">
            <strong>Assigned:</strong>

            <span>
              {new Date(
                assignment.assignedAt
              ).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {assignment?._id && (
        <div className="assignment-card-footer">
          <Link
            to={`/judge/assignments/${assignment._id}`}
            className="btn btn-primary"
          >
            View Assignment
          </Link>
        </div>
      )}
    </div>
  );
}

export default JudgeAssignmentCard;