import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import eventService from "../../services/eventService";
import EventStatusBadge from "../../components/events/EventStatusBadge";

function formatDate(date) {
  if (!date) {
    return "Not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventDetails() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");

      if (!eventId) {
        throw new Error("Event ID is missing.");
      }

      let response;

      try {
        response = await eventService.getEventById(eventId);
      } catch (idError) {
        response = await eventService.getEventBySlug(eventId);
      }

      const eventData =
        response?.data?.event ||
        response?.data ||
        response?.event ||
        null;

      if (!eventData) {
        throw new Error("Event not found.");
      }

      setEvent(eventData);
    } catch (err) {
      setEvent(null);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load event."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Event not found</h2>

          <p>
            {error ||
              "The requested event could not be found."}
          </p>

          <Link
            to="/events"
            className="event-view-button"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container event-details-page">
      <Link
        to="/events"
        className="back-link"
      >
        ← Back to Events
      </Link>

      <div className="event-details-card">
        <div className="event-details-banner">
          {event.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event.title || "Hackathon"}
            />
          ) : (
            <div className="event-details-placeholder">
              🚀
            </div>
          )}
        </div>

        <div className="event-details-content">
          <div className="event-details-top">
            <div>
              <p className="page-eyebrow">
                HACKATHON
              </p>

              <h1>{event.title}</h1>
            </div>

            <EventStatusBadge event={event} />
          </div>

          {event.description && (
            <div className="event-section">
              <h2>About this Event</h2>
              <p>{event.description}</p>
            </div>
          )}

          <div className="event-info-grid">
            <div className="event-info-box">
              <span>Start</span>
              <strong>
                {formatDate(event.startDate)}
              </strong>
            </div>

            <div className="event-info-box">
              <span>End</span>
              <strong>
                {formatDate(event.endDate)}
              </strong>
            </div>

            <div className="event-info-box">
              <span>Registration Deadline</span>
              <strong>
                {formatDate(event.registrationDeadline)}
              </strong>
            </div>

            <div className="event-info-box">
              <span>Submission Deadline</span>
              <strong>
                {formatDate(event.submissionDeadline)}
              </strong>
            </div>

            <div className="event-info-box">
              <span>Mode</span>
              <strong>
                {event.mode || "Not specified"}
              </strong>
            </div>

            <div className="event-info-box">
              <span>Location</span>
              <strong>
                {event.location || "Not specified"}
              </strong>
            </div>

            <div className="event-info-box">
              <span>Team Size</span>
              <strong>
                {event.minTeamSize ?? 1} -{" "}
                {event.maxTeamSize ?? 4}
              </strong>
            </div>
          </div>

          {Array.isArray(event.tags) &&
            event.tags.length > 0 && (
              <div className="event-section">
                <h2>Tags</h2>

                <div className="event-tags-list">
                  {event.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="event-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {event.rules && (
            <div className="event-section">
              <h2>Rules</h2>

              <p className="event-rules">
                {event.rules}
              </p>
            </div>
          )}

          <div className="event-action-area">
            <Link
              to="/login"
              className="event-register-button"
            >
              Login to Participate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;