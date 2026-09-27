import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import eventService from "../../services/eventService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function normalizeId(value) {
  if (!value) return null;

  if (
    typeof value === "object" &&
    value.$oid
  ) {
    return String(value.$oid);
  }

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

function getEventId(event, fallbackId) {
  const id =
    event?._id ??
    event?.id ??
    event?.eventId ??
    fallbackId ??
    null;

  return normalizeId(id);
}

function EventManagement() {
  const { eventId: routeEventId } =
    useParams();

  const navigate = useNavigate();

  const eventId =
    normalizeId(routeEventId);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await eventService.getEventById(
          eventId
        );

      const data =
        response?.data?.event ||
        response?.event ||
        response?.data ||
        null;

      if (!data) {
        setError("Event not found.");
        setEvent(null);
        return;
      }

      const realEventId =
        getEventId(data, eventId);

      if (!realEventId) {
        setError(
          "This event does not have a valid ID."
        );
        setEvent(null);
        return;
      }

      setEvent(data);

      localStorage.setItem(
        "dogfood_current_event_id",
        realEventId
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load event."
      );

      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !event) {
    return (
      <div className="page-container">
        <ErrorMessage
          message={
            error || "Event not found."
          }
        />

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate("/organizer/events")
          }
        >
          ← Back to Event Management
        </button>
      </div>
    );
  }

  const id = getEventId(
    event,
    eventId
  );

  if (!id) {
    return (
      <div className="page-container">
        <ErrorMessage message="Event ID is missing." />

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate("/organizer/events")
          }
        >
          ← Back to Event Management
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <span className="page-label">
            EVENT MANAGEMENT
          </span>

          <h1>
            {event.title ||
              "Event Management"}
          </h1>

          <p>
            Manage all configuration for
            this hackathon.
          </p>
        </div>

        <Link
          to="/organizer/events"
          className="btn btn-secondary"
        >
          ← Back to Events
        </Link>
      </div>


      <div className="dashboard-content-grid">

        {/* =========================
            EVENT DETAILS
        ========================= */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">
            <div>
              <h2>Event Details</h2>

              <p>
                Basic information about this
                hackathon.
              </p>
            </div>

            <span>📅</span>
          </div>


          <div className="detail-list">

            <div className="detail-row">
              <strong>Title</strong>

              <span>
                {event.title || "-"}
              </span>
            </div>


            <div className="detail-row">
              <strong>Description</strong>

              <span>
                {event.description || "-"}
              </span>
            </div>


            <div className="detail-row">
              <strong>Mode</strong>

              <span>
                {event.mode || "-"}
              </span>
            </div>


            <div className="detail-row">
              <strong>Location</strong>

              <span>
                {event.location || "Online"}
              </span>
            </div>


            <div className="detail-row">
              <strong>Start Date</strong>

              <span>
                {event.startDate
                  ? new Date(
                      event.startDate
                    ).toLocaleString()
                  : "-"}
              </span>
            </div>


            <div className="detail-row">
              <strong>End Date</strong>

              <span>
                {event.endDate
                  ? new Date(
                      event.endDate
                    ).toLocaleString()
                  : "-"}
              </span>
            </div>

          </div>
        </div>


        {/* =========================
            MANAGE EVENT
        ========================= */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">
            <div>
              <h2>Manage Event</h2>

              <p>
                Configure tracks, prizes,
                teams and projects.
              </p>
            </div>

            <span>⚙️</span>
          </div>


          <div className="quick-actions">

            {/* TRACKS */}

            <Link
              to={`/organizer/events/${encodeURIComponent(
                id
              )}/tracks`}
              className="quick-action"
            >
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                🎯
              </span>

              <strong>
                Manage Tracks
              </strong>

              <span>
                Create and manage challenge
                tracks.
              </span>
            </Link>


            {/* PRIZES */}

            <Link
              to={`/organizer/events/${encodeURIComponent(
                id
              )}/prizes`}
              className="quick-action"
            >
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                🏆
              </span>

              <strong>
                Manage Prizes
              </strong>

              <span>
                Configure prizes and awards.
              </span>
            </Link>


            {/* TEAMS */}

            <Link
              to={`/organizer/teams?eventId=${encodeURIComponent(
                id
              )}`}
              className="quick-action"
            >
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                👥
              </span>

              <strong>
                Manage Teams
              </strong>

              <span>
                View teams participating in
                this event.
              </span>
            </Link>


            {/* PROJECTS */}

            <Link
              to={`/organizer/projects?eventId=${encodeURIComponent(
                id
              )}`}
              className="quick-action"
            >
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                💻
              </span>

              <strong>
                Manage Projects
              </strong>

              <span>
                View submitted hackathon
                projects.
              </span>
            </Link>


            {/* JUDGES */}

            <Link
              to="/organizer/judges"
              className="quick-action"
            >
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                ⚖️
              </span>

              <strong>
                Manage Judges
              </strong>

              <span>
                Assign judges to projects.
              </span>
            </Link>


            {/* RUBRICS */}

            <Link
              to="/organizer/rubrics"
              className="quick-action"
            >
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                📝
              </span>

              <strong>
                Manage Rubrics
              </strong>

              <span>
                Configure judging criteria.
              </span>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}

export default EventManagement;