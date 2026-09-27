import { Link } from "react-router-dom";
import EventStatusBadge from "./EventStatusBadge";

function formatDate(date) {
  if (!date) {
    return "Not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EventCard({ event }) {
  if (!event) {
    return null;
  }

  return (
    <article className="event-card">
      <div className="event-card-image">
        {event.bannerImage ? (
          <img
            src={event.bannerImage}
            alt={event.title || "Hackathon event"}
          />
        ) : (
          <div className="event-card-placeholder">
            <span>🚀</span>
          </div>
        )}

        <div className="event-card-status">
          <EventStatusBadge event={event} />
        </div>
      </div>

      <div className="event-card-content">
        <div className="event-card-tags">
          {event.mode && (
            <span className="event-tag">
              {event.mode}
            </span>
          )}

          {event.location && (
            <span className="event-tag">
              📍 {event.location}
            </span>
          )}
        </div>

        <h3>{event.title}</h3>

        <p className="event-description">
          {event.description
            ? event.description.length > 120
              ? `${event.description.substring(0, 120)}...`
              : event.description
            : "No description available."}
        </p>

        <div className="event-card-info">
          <div>
            <span>Starts</span>
            <strong>
              {formatDate(event.startDate)}
            </strong>
          </div>

          <div>
            <span>Registration</span>
            <strong>
              {formatDate(event.registrationDeadline)}
            </strong>
          </div>
        </div>

        <Link
          to={`/events/${event.slug || event._id}`}
          className="event-view-button"
        >
          View Event
        </Link>
      </div>
    </article>
  );
}

export default EventCard;