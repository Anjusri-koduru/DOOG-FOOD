import { useEffect, useMemo, useState } from "react";
import EventCard from "../../components/events/EventCard";
import EventFilters from "../../components/events/EventFilters";
import eventService from "../../services/eventService";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await eventService.getPublicEvents();

      const eventList =
        response?.data?.events ||
        response?.data ||
        response?.events ||
        [];

      setEvents(
        Array.isArray(eventList)
          ? eventList
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return events.filter((event) => {
      const matchesSearch =
        !searchText ||
        event.title
          ?.toLowerCase()
          .includes(searchText) ||
        event.description
          ?.toLowerCase()
          .includes(searchText) ||
        event.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesMode =
        !mode ||
        event.mode?.toLowerCase() ===
          mode.toLowerCase();

      return matchesSearch && matchesMode;
    });
  }, [events, search, mode]);

  return (
    <div className="page-container events-page">
      <div className="events-hero">
        <div>
          <p className="page-eyebrow">
            DOGFOOD HACKATHONS
          </p>

          <h1>Discover Hackathons</h1>

          <p>
            Find hackathons, build amazing projects,
            and compete with talented developers.
          </p>
        </div>
      </div>

      <EventFilters
        search={search}
        setSearch={setSearch}
        mode={mode}
        setMode={setMode}
      />

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            🚀
          </div>

          <h3>No events found</h3>

          <p>
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;