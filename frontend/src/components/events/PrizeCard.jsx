function PrizeCard({
  prize,
  trackName,
  onEdit,
  onDelete,
  onToggle,
}) {
  if (!prize) {
    return null;
  }

  return (
    <div className="prize-card">
      <div className="prize-rank">
        {prize.rank
          ? `#${prize.rank}`
          : "🏆"}
      </div>

      <div className="prize-content">
        <div className="prize-header">
          <div>
            <h3>{prize.title}</h3>

            {trackName && (
              <span className="prize-track">
                🎯 {trackName}
              </span>
            )}
          </div>

          <span
            className={
              prize.isActive
                ? "status-badge status-active"
                : "status-badge status-inactive"
            }
          >
            {prize.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        {prize.description && (
          <p className="prize-description">
            {prize.description}
          </p>
        )}

        <div className="prize-details">
          <div>
            <span>Prize Amount</span>

            <strong>
              {prize.currency || "INR"}{" "}
              {Number(prize.amount || 0).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>Quantity</span>

            <strong>
              {prize.quantity || 1}
            </strong>
          </div>
        </div>

        <div className="prize-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => onEdit(prize)}
          >
            Edit
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => onToggle(prize)}
          >
            {prize.isActive
              ? "Deactivate"
              : "Activate"}
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={() => onDelete(prize)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrizeCard;