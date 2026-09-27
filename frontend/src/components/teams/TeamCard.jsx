import { Link } from "react-router-dom";

function TeamCard({ team }) {
  if (!team) {
    return null;
  }

  const members = Array.isArray(team.members)
    ? team.members
    : [];

  const eventName =
    team.event?.title ||
    team.event?.name ||
    "Hackathon Event";

  const leaderName =
    team.leader?.name ||
    team.leader?.email ||
    "Team Leader";

  return (
    <div className="team-card">
      <div className="team-card-header">
        <div className="team-icon">
          👥
        </div>

        <span
          className={
            team.status === "disbanded"
              ? "status-badge status-inactive"
              : "status-badge status-active"
          }
        >
          {team.status === "disbanded"
            ? "Disbanded"
            : "Active"}
        </span>
      </div>

      <h3>{team.name}</h3>

      <p className="team-event">
        🎯 {eventName}
      </p>

      <div className="team-info-grid">
        <div>
          <span>Leader</span>
          <strong>{leaderName}</strong>
        </div>

        <div>
          <span>Members</span>
          <strong>
            {members.length}
          </strong>
        </div>
      </div>

      <Link
        to={`/teams/${team._id}`}
        className="primary-button team-view-button"
      >
        View Team
      </Link>
    </div>
  );
}

export default TeamCard;