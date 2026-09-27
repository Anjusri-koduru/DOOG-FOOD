function StatCard({
  title,
  value,
  icon,
  description,
  onClick,
}) {
  return (
    <div
      className={`dashboard-stat-card ${
        onClick ? "dashboard-stat-card-clickable" : ""
      }`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (onClick && event.key === "Enter") {
          onClick();
        }
      }}
    >
      <div className="dashboard-stat-card-icon">
        {icon}
      </div>

      <div className="dashboard-stat-card-content">
        <p className="dashboard-stat-card-title">
          {title}
        </p>

        <h3 className="dashboard-stat-card-value">
          {value ?? 0}
        </h3>

        {description && (
          <p className="dashboard-stat-card-description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;