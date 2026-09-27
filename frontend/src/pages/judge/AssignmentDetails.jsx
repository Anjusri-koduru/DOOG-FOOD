import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import judgeService from "../../services/judgeService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AssignmentDetails() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssignment();
  }, [assignmentId]);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await judgeService.getAssignmentById(
          assignmentId
        );

      const data =
        response?.data?.assignment ||
        response?.data ||
        response?.assignment ||
        null;

      setAssignment(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      setError("");

      const response =
        await judgeService.updateAssignmentStatus(
          assignmentId,
          status
        );

      const updated =
        response?.data?.assignment ||
        response?.data ||
        response?.assignment ||
        null;

      if (updated) {
        setAssignment(updated);
      } else {
        await loadAssignment();
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update assignment."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!assignment) {
    return (
      <div className="page-container">
        <ErrorMessage
          message={error || "Assignment not found."}
        />

        <Link
          to="/judge/assignments"
          className="btn btn-primary"
        >
          Back to Assignments
        </Link>
      </div>
    );
  }

  const project = assignment.project;
  const event = assignment.event;
  const judge = assignment.judge;
  const track = assignment.track;

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <Link
            to="/judge/assignments"
            className="back-link"
          >
            ← Back to Assignments
          </Link>

          <h1>
            {project?.title || "Project Assignment"}
          </h1>

          <p>
            {event?.title || "Hackathon Event"}
          </p>
        </div>

        <span className="assignment-status large">
          {assignment.status || "assigned"}
        </span>

      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      <div className="assignment-details-grid">

        <div className="assignment-details-card">

          <h2>Assignment Information</h2>

          <div className="detail-row">
            <strong>Status</strong>
            <span>
              {assignment.status || "assigned"}
            </span>
          </div>

          <div className="detail-row">
            <strong>Judge</strong>
            <span>
              {judge?.name ||
                judge?.email ||
                "Current Judge"}
            </span>
          </div>

          <div className="detail-row">
            <strong>Event</strong>
            <span>
              {event?.title || "N/A"}
            </span>
          </div>

          <div className="detail-row">
            <strong>Track</strong>
            <span>
              {track?.name || "All Tracks"}
            </span>
          </div>

          <div className="detail-row">
            <strong>Assigned At</strong>
            <span>
              {assignment.assignedAt
                ? new Date(
                    assignment.assignedAt
                  ).toLocaleString()
                : "N/A"}
            </span>
          </div>

        </div>

        <div className="assignment-details-card">

          <h2>Project</h2>

          <div className="project-summary">

            <h3>
              {project?.title || "Project"}
            </h3>

            {project?.description && (
              <p>
                {project.description}
              </p>
            )}

            {project?.team && (
              <div className="detail-row">
                <strong>Team</strong>
                <span>
                  {project.team?.name ||
                    project.team}
                </span>
              </div>
            )}

            {project?.technologies?.length > 0 && (
              <div className="technology-list">
                {project.technologies.map(
                  (technology, index) => (
                    <span
                      key={`${technology}-${index}`}
                      className="technology-tag"
                    >
                      {technology}
                    </span>
                  )
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      <div className="assignment-actions">

        {assignment.status === "assigned" && (
          <button
            type="button"
            className="btn btn-primary"
            disabled={updating}
            onClick={() =>
              updateStatus("in_progress")
            }
          >
            {updating
              ? "Updating..."
              : "Start Judging"}
          </button>
        )}

        {assignment.status === "in_progress" && (
          <button
            type="button"
            className="btn btn-success"
            disabled={updating}
            onClick={() =>
              updateStatus("completed")
            }
          >
            {updating
              ? "Updating..."
              : "Mark Completed"}
          </button>
        )}

        {assignment.status === "cancelled" && (
          <p className="warning-text">
            This assignment has been cancelled.
          </p>
        )}

        {assignment.status === "completed" && (
          <p className="success-text">
            This assignment has been completed.
          </p>
        )}

      </div>

    </div>
  );
}

export default AssignmentDetails;