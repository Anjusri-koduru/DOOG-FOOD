function EmptyState({
  title = "No data found",
  message = "There is nothing to display here yet.",
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📭</div>

      <h3>{title}</h3>

      <p>{message}</p>

      {action && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;