import { useEffect, useState } from "react";

import rubricService from "../../services/rubricService";
import RubricForm from "../../components/judging/RubricForm";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

function ManageRubrics() {
  const [eventId, setEventId] = useState("");
  const [rubrics, setRubrics] = useState([]);

  const [selectedRubric, setSelectedRubric] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const extractRubrics = (response) => {
    const data =
      response?.data?.rubrics ||
      response?.data ||
      response?.rubrics ||
      [];

    return Array.isArray(data)
      ? data
      : [];
  };

  const loadRubrics = async () => {
    if (!eventId.trim()) {
      setError("Please enter an Event ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response =
        await rubricService.getEventRubrics(
          eventId.trim()
        );

      setRubrics(
        extractRubrics(response)
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load rubrics."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRubric(null);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleEdit = (rubric) => {
    setSelectedRubric(rubric);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleFormSubmit = async (
    rubricData
  ) => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (selectedRubric) {
        await rubricService.updateRubric(
          selectedRubric._id,
          rubricData
        );

        setMessage(
          "Rubric updated successfully."
        );
      } else {
        await rubricService.createRubric(
          rubricData
        );

        setMessage(
          "Rubric created successfully."
        );
      }

      setShowForm(false);
      setSelectedRubric(null);

      setEventId(rubricData.event);

      const response =
        await rubricService.getEventRubrics(
          rubricData.event
        );

      setRubrics(
        extractRubrics(response)
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save rubric."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    rubricId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this rubric?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await rubricService.deleteRubric(
        rubricId
      );

      setMessage(
        "Rubric deleted successfully."
      );

      await loadRubrics();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete rubric."
      );
    }
  };

  const getEventName = (rubric) => {
    if (
      rubric?.event &&
      typeof rubric.event === "object"
    ) {
      return (
        rubric.event.title ||
        rubric.event.name ||
        rubric.event._id ||
        "Event"
      );
    }

    return rubric?.event || "Event";
  };

  const getTrackName = (rubric) => {
    if (!rubric?.track) {
      return "All Tracks";
    }

    if (
      typeof rubric.track === "object"
    ) {
      return (
        rubric.track.name ||
        rubric.track.title ||
        rubric.track._id ||
        "Track"
      );
    }

    return rubric.track;
  };

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <h1>Manage Rubrics</h1>

          <p>
            Create and manage evaluation criteria for hackathon judging.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCreate}
        >
          + Create Rubric
        </button>

      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {/* Event Search */}
      <div className="management-card">

        <h2>Load Event Rubrics</h2>

        <div className="rubric-event-search">

          <div className="form-group">
            <label htmlFor="rubric-event-id">
              Event ID
            </label>

            <input
              id="rubric-event-id"
              type="text"
              value={eventId}
              onChange={(event) =>
                setEventId(
                  event.target.value
                )
              }
              placeholder="Enter Event ID"
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadRubrics}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Load Rubrics"}
          </button>

        </div>

      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="management-card rubric-form-wrapper">

          <div className="section-header">

            <div>
              <h2>
                {selectedRubric
                  ? "Edit Rubric"
                  : "Create Rubric"}
              </h2>

              <p>
                Total criteria weight must equal 100%.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setSelectedRubric(null);
              }}
            >
              Close
            </button>

          </div>

          <RubricForm
            initialData={selectedRubric}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedRubric(null);
            }}
            loading={saving}
          />

        </div>
      )}

      {/* Rubrics */}
      <div className="management-card">

        <div className="section-header">

          <div>
            <h2>Rubrics</h2>

            <p>
              {rubrics.length} rubric(s) found.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadRubrics}
            disabled={loading || !eventId.trim()}
          >
            Refresh
          </button>

        </div>

        {loading ? (
          <Loader />
        ) : rubrics.length === 0 ? (
          <EmptyState
            title="No rubrics found"
            message="Load an event or create a new rubric."
          />
        ) : (
          <div className="rubric-list">

            {rubrics.map((rubric) => {

              const totalWeight =
                Array.isArray(
                  rubric.criteria
                )
                  ? rubric.criteria.reduce(
                      (total, criterion) =>
                        total +
                        Number(
                          criterion.weight || 0
                        ),
                      0
                    )
                  : Number(
                      rubric.totalWeight || 0
                    );

              return (
                <div
                  className="rubric-card"
                  key={rubric._id}
                >

                  <div className="rubric-card-header">

                    <div>
                      <h3>
                        {rubric.name ||
                          "Untitled Rubric"}
                      </h3>

                      <p>
                        {rubric.description ||
                          "No description provided."}
                      </p>
                    </div>

                    <span
                      className={
                        rubric.isActive === false
                          ? "rubric-status inactive"
                          : "rubric-status active"
                      }
                    >
                      {rubric.isActive === false
                        ? "Inactive"
                        : "Active"}
                    </span>

                  </div>

                  <div className="rubric-meta">

                    <span>
                      <strong>
                        Event:
                      </strong>{" "}
                      {getEventName(rubric)}
                    </span>

                    <span>
                      <strong>
                        Track:
                      </strong>{" "}
                      {getTrackName(rubric)}
                    </span>

                    <span>
                      <strong>
                        Criteria:
                      </strong>{" "}
                      {rubric.criteria?.length ||
                        0}
                    </span>

                    <span>
                      <strong>
                        Weight:
                      </strong>{" "}
                      {totalWeight}%
                    </span>

                  </div>

                  {Array.isArray(
                    rubric.criteria
                  ) &&
                    rubric.criteria.length > 0 && (
                      <div className="rubric-criteria-preview">

                        {rubric.criteria.map(
                          (
                            criterion,
                            index
                          ) => (
                            <div
                              className="criterion-preview-row"
                              key={
                                criterion._id ||
                                index
                              }
                            >
                              <div>
                                <strong>
                                  {criterion.name}
                                </strong>

                                {criterion.description && (
                                  <p>
                                    {
                                      criterion.description
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="criterion-score-info">
                                <span>
                                  Max:{" "}
                                  {
                                    criterion.maxScore
                                  }
                                </span>

                                <span>
                                  Weight:{" "}
                                  {
                                    criterion.weight
                                  }
                                  %
                                </span>
                              </div>
                            </div>
                          )
                        )}

                      </div>
                    )}

                  <div className="rubric-card-actions">

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        handleEdit(rubric)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        handleDelete(
                          rubric._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default ManageRubrics;