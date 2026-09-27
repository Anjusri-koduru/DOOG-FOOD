import { useEffect, useState } from "react";

import judgeService from "../../services/judgeService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function ManageJudges() {
  const [eventId, setEventId] = useState("");
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState({
    event: "",
    judge: "",
    project: "",
    track: "",
  });

  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAssignments = async () => {
    if (!eventId.trim()) {
      setError("Please enter an Event ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response =
        await judgeService.getEventAssignments(
          eventId.trim()
        );

      const data =
        response?.data?.assignments ||
        response?.data ||
        response?.assignments ||
        [];

      setAssignments(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load event assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm((previous) => ({
      ...previous,
      event: eventId,
    }));
  }, [eventId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAssign = async (event) => {
    event.preventDefault();

    if (!form.event.trim()) {
      setError("Event ID is required.");
      return;
    }

    if (!form.judge.trim()) {
      setError("Judge ID is required.");
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setMessage("");

      const payload = {
        event: form.event.trim(),
        judge: form.judge.trim(),
      };

      if (form.project.trim()) {
        payload.project = form.project.trim();
      }

      if (form.track.trim()) {
        payload.track = form.track.trim();
      }

      await judgeService.createAssignment(payload);

      setMessage(
        "Judge assignment created successfully."
      );

      setForm((previous) => ({
        ...previous,
        judge: "",
        project: "",
        track: "",
      }));

      setEventId(form.event);

      await loadAssignments();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create judge assignment."
      );
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusChange = async (
    assignmentId,
    status
  ) => {
    try {
      setError("");
      setMessage("");

      await judgeService.updateAssignmentStatus(
        assignmentId,
        status
      );

      setMessage(
        "Assignment status updated successfully."
      );

      await loadAssignments();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update assignment."
      );
    }
  };

  const handleDelete = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this judge assignment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await judgeService.deleteAssignment(
        assignmentId
      );

      setMessage(
        "Judge assignment removed successfully."
      );

      await loadAssignments();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to remove assignment."
      );
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Manage Judges</h1>

          <p>
            Assign judges to hackathon projects and tracks.
          </p>
        </div>
      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="manage-judges-layout">

        {/* Event Selection */}
        <div className="management-card">

          <h2>Load Event Assignments</h2>

          <div className="form-group">
            <label htmlFor="eventId">
              Event ID
            </label>

            <input
              id="eventId"
              type="text"
              value={eventId}
              onChange={(event) =>
                setEventId(event.target.value)
              }
              placeholder="Enter Event ID"
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadAssignments}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Load Assignments"}
          </button>

        </div>

        {/* Assign Judge */}
        <div className="management-card">

          <h2>Assign Judge</h2>

          <form onSubmit={handleAssign}>

            <div className="form-group">
              <label htmlFor="event">
                Event ID
              </label>

              <input
                id="event"
                name="event"
                type="text"
                value={form.event}
                onChange={handleChange}
                placeholder="Event ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="judge">
                Judge User ID
              </label>

              <input
                id="judge"
                name="judge"
                type="text"
                value={form.judge}
                onChange={handleChange}
                placeholder="Judge User ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="project">
                Project ID
              </label>

              <input
                id="project"
                name="project"
                type="text"
                value={form.project}
                onChange={handleChange}
                placeholder="Optional Project ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="track">
                Track ID
              </label>

              <input
                id="track"
                name="track"
                type="text"
                value={form.track}
                onChange={handleChange}
                placeholder="Optional Track ID"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={assigning}
            >
              {assigning
                ? "Assigning..."
                : "Assign Judge"}
            </button>

          </form>

        </div>

      </div>

      {/* Assignments */}
      <div className="management-card">

        <div className="section-header">
          <h2>Event Judge Assignments</h2>

          <span>
            {assignments.length} assignment(s)
          </span>
        </div>

        {loading ? (
          <Loader />
        ) : assignments.length === 0 ? (
          <div className="empty-state">
            <h3>No assignments found</h3>

            <p>
              Load an event to see its judge assignments.
            </p>
          </div>
        ) : (
          <div className="admin-assignment-table">

            <div className="assignment-table-header">
              <span>Project</span>
              <span>Judge</span>
              <span>Track</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {assignments.map((assignment) => (

              <div
                className="assignment-table-row"
                key={assignment._id}
              >

                <span>
                  {assignment?.project?.title ||
                    assignment?.project ||
                    "All Projects"}
                </span>

                <span>
                  {assignment?.judge?.name ||
                    assignment?.judge?.email ||
                    assignment?.judge ||
                    "N/A"}
                </span>

                <span>
                  {assignment?.track?.name ||
                    assignment?.track ||
                    "All Tracks"}
                </span>

                <span>
                  <span className="assignment-status">
                    {assignment.status ||
                      "assigned"}
                  </span>
                </span>

                <div className="assignment-actions-small">

                  {assignment.status ===
                    "assigned" && (
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() =>
                        handleStatusChange(
                          assignment._id,
                          "in_progress"
                        )
                      }
                    >
                      Start
                    </button>
                  )}

                  {assignment.status ===
                    "in_progress" && (
                    <button
                      type="button"
                      className="btn btn-small btn-success"
                      onClick={() =>
                        handleStatusChange(
                          assignment._id,
                          "completed"
                        )
                      }
                    >
                      Complete
                    </button>
                  )}

                  {assignment.status !==
                    "cancelled" && (
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() =>
                        handleStatusChange(
                          assignment._id,
                          "cancelled"
                        )
                      }
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-small btn-danger"
                    onClick={() =>
                      handleDelete(
                        assignment._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default ManageJudges;