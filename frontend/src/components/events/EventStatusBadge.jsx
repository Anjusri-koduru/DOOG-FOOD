function EventStatusBadge({ event }) {
  if (!event) {
    return null;
  }

  const now = new Date();

  const start = event.startDate
    ? new Date(event.startDate)
    : event.start
      ? new Date(event.start)
      : null;

  const end = event.endDate
    ? new Date(event.endDate)
    : event.end
      ? new Date(event.end)
      : null;

  let status = "Draft";

  if (!event.isPublished) {
    status = "Draft";
  } else if (start && now < start) {
    status = "Upcoming";
  } else if (start && end && now >= start && now <= end) {
    status = "Live";
  } else if (end && now > end) {
    status = "Completed";
  } else {
    status = "Published";
  }

  const className = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`event-status-badge ${className}`}>
      {status}
    </span>
  );
}

export default EventStatusBadge;