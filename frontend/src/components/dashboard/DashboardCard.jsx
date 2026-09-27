import { Link } from "react-router-dom";

function DashboardCard({
  title,
  description,
  icon,
  link,
  buttonText = "Open",
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-icon">
        {icon}
      </div>

      <div className="dashboard-card-content">
        <h3>{title}</h3>

        <p>{description}</p>

        <Link
          to={link}
          className="btn btn-primary"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

export default DashboardCard;