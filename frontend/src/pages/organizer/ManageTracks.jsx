import {
  Link,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../../services/api";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function normalizeEventId(value) {
  if (!value) return null;

  const id = String(value).trim();

  if (
    !id ||
    id === "null" ||
    id === "undefined"
  ) {
    return null;
  }

  return id;
}

function ManageTracks() {
  const { eventId: routeEventId } =
    useParams();

  const eventId =
    normalizeEventId(routeEventId);

  const [tracks, setTracks] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    rules: "",
    isActive: true,
  });


  useEffect(() => {
    if (!eventId) {
      setError(
        "Event ID is missing. Please open Manage Tracks from a specific event."
      );

      setLoading(false);

      return;
    }

    localStorage.setItem(
      "dogfood_current_event_id",
      eventId
    );

    loadTracks();
  }, [eventId]);


  const loadTracks = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          `/tracks/event/${eventId}`
        );

      const data =
        response?.data?.data?.tracks ||
        response?.data?.tracks ||
        response?.data?.data ||
        response?.data ||
        [];

      setTracks(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load tracks."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!eventId) {
      setError("Event ID is missing.");
      return;
    }

    if (!form.name.trim()) {
      setError("Track name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/tracks", {
        event: eventId,
        name: form.name.trim(),
        description:
          form.description.trim(),
        rules: form.rules.trim(),
        isActive: form.isActive,
      });

      setForm({
        name: "",
        description: "",
        rules: "",
        isActive: true,
      });

      setSuccess(
        "Track created successfully."
      );

      await loadTracks();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create track."
      );
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (
    trackId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this track?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/tracks/${trackId}`
      );

      setSuccess(
        "Track deleted successfully."
      );

      await loadTracks();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete track."
      );
    }
  };


  if (loading) {
    return <Loader />;
  }


  return (
    <div className="page-container">

      <Link
        to={`/organizer/events/${encodeURIComponent(
          eventId || ""
        )}`}
        className="back-link"
      >
        ← Back to Event Management
      </Link>


      <div className="page-header">
        <div>

          <span className="page-label">
            EVENT MANAGEMENT
          </span>

          <h1>
            Manage Tracks
          </h1>

          <p>
            Create and manage challenge
            tracks for this hackathon.
          </p>

        </div>
      </div>


      {error && (
        <ErrorMessage
          message={error}
        />
      )}


      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      {!eventId ? (
        <div className="empty-state">

          <div className="empty-state-icon">
            ⚠️
          </div>

          <h2>
            Event ID missing
          </h2>

          <p>
            Please open this page from Event
            Management.
          </p>

        </div>
      ) : (
        <>

          {/* CREATE TRACK */}

          <div className="form-card">

            <div className="card-header">

              <h2>
                Create Track
              </h2>

              <p>
                Add a new challenge track.
              </p>

            </div>


            <form
              className="module-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label htmlFor="track-name">
                  Track Name *
                </label>

                <input
                  id="track-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: AI & Machine Learning"
                  disabled={saving}
                />

              </div>


              <div className="form-group">

                <label htmlFor="track-description">
                  Description
                </label>

                <textarea
                  id="track-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this challenge track."
                  rows="4"
                  disabled={saving}
                />

              </div>


              <div className="form-group">

                <label htmlFor="track-rules">
                  Rules
                </label>

                <textarea
                  id="track-rules"
                  name="rules"
                  value={form.rules}
                  onChange={handleChange}
                  placeholder="Enter rules for this track."
                  rows="4"
                  disabled={saving}
                />

              </div>


              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  disabled={saving}
                />

                Track is active

              </label>


              <div className="form-actions">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Creating..."
                    : "Create Track"}
                </button>

              </div>

            </form>

          </div>


          {/* TRACK LIST */}

          <div className="dashboard-section">

            <div className="section-header">

              <h2>
                Tracks
              </h2>

              <strong>
                {tracks.length} Tracks
              </strong>

            </div>


            {tracks.length === 0 ? (
              <div className="empty-state">

                <div className="empty-state-icon">
                  🎯
                </div>

                <h3>
                  No tracks yet
                </h3>

                <p>
                  Create the first track for
                  this event.
                </p>

              </div>
            ) : (
              <div className="card-grid">

                {tracks.map((track) => (

                  <div
                    className="dashboard-card"
                    key={
                      track._id ||
                      track.id
                    }
                  >

                    <div className="dashboard-card-header">

                      <div>

                        <h3>
                          {track.name ||
                            track.title ||
                            "Track"}
                        </h3>

                        <p>
                          {track.description ||
                            "No description"}
                        </p>

                      </div>

                      <span>
                        🎯
                      </span>

                    </div>


                    {track.rules && (
                      <p>
                        <strong>
                          Rules:
                        </strong>{" "}
                        {track.rules}
                      </p>
                    )}


                    <div className="form-actions">

                      <span
                        className={
                          track.isActive ===
                          false
                            ? "status-badge inactive"
                            : "status-badge active"
                        }
                      >
                        {track.isActive ===
                        false
                          ? "Inactive"
                          : "Active"}
                      </span>


                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          handleDelete(
                            track._id ||
                              track.id
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

        </>
      )}

    </div>
  );
}

export default ManageTracks;