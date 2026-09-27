import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import eventService from "../../services/eventService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await eventService.getAllEvents();

      const data =
        response?.data?.events ||
        response?.data ||
        response?.events ||
        [];

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Manage Events</h1>

          <p>
            View and monitor hackathon events across
            the DOGFOOD platform.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadEvents}
        >
          Refresh
        </button>
      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>All Events</h2>

            <p>
              Total events: {events.length}
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <h3>No events found</h3>

            <p>
              There are currently no events available.
            </p>
          </div>
        ) : (
          <div className="dashboard-card-grid">
            {events.map((event) => (
              <div
                key={event._id}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">
                  🎯
                </div>

                <div className="dashboard-card-content">
                  <h3>
                    {event.title || "Untitled Event"}
                  </h3>

                  <p>
                    {event.description
                      ? event.description.length > 150
                        ? `${event.description.slice(
                            0,
                            150
                          )}...`
                        : event.description
                      : "No description available."}
                  </p>

                  <p>
                    <strong>Start:</strong>{" "}
                    {formatDate(event.start)}
                  </p>

                  <p>
                    <strong>End:</strong>{" "}
                    {formatDate(event.end)}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {event.isPublished
                      ? "Published"
                      : "Draft"}
                  </p>

                  <Link
                    to={`/events/${event._id}`}
                    className="btn btn-primary"
                  >
                    View Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEvents;