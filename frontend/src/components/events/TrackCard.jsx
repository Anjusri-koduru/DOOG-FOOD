function TrackCard({
  track,
  onEdit,
  onDelete,
  onToggle,
}) {
  if (!track) {
    return null;
  }

  return (
    <div className="track-card">
      <div className="track-card-top">
        <div className="track-icon">
          🎯
        </div>

        <span
          className={
            track.isActive
              ? "status-badge status-active"
              : "status-badge status-inactive"
          }
        >
          {track.isActive
            ? "Active"
            : "Inactive"}
        </span>
      </div>

      <h3>{track.name}</h3>

      {track.description && (
        <p className="track-description">
          {track.description}
        </p>
      )}

      {track.rules && (
        <div className="track-rules">
          <strong>Rules</strong>
          <p>{track.rules}</p>
        </div>
      )}

      <div className="track-slug">
        <span>Slug:</span>
        <code>{track.slug}</code>
      </div>

      <div className="track-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => onEdit(track)}
        >
          Edit
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => onToggle(track)}
        >
          {track.isActive
            ? "Deactivate"
            : "Activate"}
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={() => onDelete(track)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TrackCard;