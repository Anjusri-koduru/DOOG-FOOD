import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import eventService from "../../services/eventService";
import EventStatusBadge from "../../components/events/EventStatusBadge";

function getEventId(event) {
  if (!event) return null;

  const rawId =
    event._id ??
    event.id ??
    event.eventId ??
    null;

  if (!rawId) return null;

  if (typeof rawId === "object" && rawId.$oid) {
    return String(rawId.$oid);
  }

  const id = String(rawId).trim();

  if (
    !id ||
    id === "null" ||
    id === "undefined"
  ) {
    return null;
  }

  return id;
}

function ManageEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await eventService.getAllEvents();

      const list =
        response?.data?.events ||
        response?.data ||
        response?.events ||
        [];

      const safeEvents = Array.isArray(list)
        ? list.filter((event) => getEventId(event))
        : [];

      setEvents(safeEvents);

      if (Array.isArray(list)) {
        const invalidEvents = list.filter(
          (event) => !getEventId(event)
        );

        if (invalidEvents.length > 0) {
          console.warn(
            "Some events were skipped because they do not contain a valid ID:",
            invalidEvents
          );
        }
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleManage = (event) => {
    const eventId = getEventId(event);

    if (!eventId) {
      setError(
        "This event does not have a valid ID."
      );
      return;
    }

    navigate(
      `/organizer/events/${encodeURIComponent(
        eventId
      )}`
    );
  };

  const handlePublishToggle = async (event) => {
    const eventId = getEventId(event);

    if (!eventId) {
      setError(
        "This event does not have a valid ID."
      );
      return;
    }

    try {
      setError("");

      if (event.isPublished) {
        await eventService.unpublishEvent(
          eventId
        );
      } else {
        await eventService.publishEvent(
          eventId
        );
      }

      await loadEvents();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update event."
      );
    }
  };

  const handleDelete = async (event) => {
    const eventId = getEventId(event);

    if (!eventId) {
      setError(
        "This event does not have a valid ID."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${event.title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await eventService.deleteEvent(
        eventId
      );

      await loadEvents();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete event."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header event-management-header">
        <div>
          <p className="page-eyebrow">
            ORGANIZER
          </p>

          <h1>Manage Events</h1>

          <p>
            Create, publish and manage your
            hackathons.
          </p>
        </div>

        <Link
          to="/organizer/events/create"
          className="event-register-button"
        >
          + Create Event
        </Link>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>

          <p>
            Loading events...
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <h3>No events yet</h3>

          <p>
            Create your first hackathon.
          </p>

          <Link
            to="/organizer/events/create"
            className="event-view-button"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="manage-events-list">
          {events.map((event) => {
            const eventId =
              getEventId(event);

            return (
              <div
                key={eventId}
                className="manage-event-card"
              >
                <div className="manage-event-main">
                  <div className="manage-event-image">
                    {event.bannerImage ? (
                      <img
                        src={event.bannerImage}
                        alt={event.title}
                      />
                    ) : (
                      <span>🚀</span>
                    )}
                  </div>

                  <div>
                    <div className="manage-event-title-row">
                      <h2>
                        {event.title}
                      </h2>

                      <EventStatusBadge
                        event={event}
                      />
                    </div>

                    <p>
                      {event.description
                        ? event.description.substring(
                            0,
                            150
                          )
                        : "No description"}
                    </p>

                    <div className="manage-event-meta">
                      <span>
                        📅{" "}
                        {event.startDate
                          ? new Date(
                              event.startDate
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : event.start
                          ? new Date(
                              event.start
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "No date"}
                      </span>

                      <span>
                        {event.mode ||
                          "online"}
                      </span>

                      <span>
                        {event.isPublished
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="manage-event-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      handleManage(event)
                    }
                  >
                    Manage
                  </button>

                  <Link
                    to={`/organizer/events/${encodeURIComponent(
                      eventId
                    )}/edit`}
                    className="secondary-button"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      handlePublishToggle(
                        event
                      )
                    }
                  >
                    {event.isPublished
                      ? "Unpublish"
                      : "Publish"}
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() =>
                      handleDelete(event)
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
  );
}

export default ManageEvents;