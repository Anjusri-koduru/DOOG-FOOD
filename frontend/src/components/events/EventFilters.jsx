function EventFilters({
  search,
  setSearch,
  mode,
  setMode,
}) {
  return (
    <div className="event-filters">
      <div className="event-search-box">
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search hackathons..."
        />
      </div>

      <select
        value={mode}
        onChange={(event) =>
          setMode(event.target.value)
        }
        className="event-mode-filter"
      >
        <option value="">All Modes</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
        <option value="hybrid">Hybrid</option>
      </select>
    </div>
  );
}

export default EventFilters;