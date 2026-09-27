import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DashboardCard from "../../components/dashboard/DashboardCard";

function ParticipantDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>
            Welcome, {user?.name || "Participant"} 👋
          </h1>

          <p>
            Manage your hackathon participation,
            teams, projects, votes and certificates.
          </p>
        </div>

        <Link
          to="/events"
          className="btn btn-primary"
        >
          Explore Events
        </Link>
      </div>

      {/* =========================
          QUICK OVERVIEW
      ========================= */}

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            👥
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Teams
            </p>

            <h3 className="dashboard-stat-card-value">
              My Teams
            </h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            💻
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Projects
            </p>

            <h3 className="dashboard-stat-card-value">
              My Projects
            </h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            🗳️
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Community
            </p>

            <h3 className="dashboard-stat-card-value">
              My Votes
            </h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            🏆
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Achievements
            </p>

            <h3 className="dashboard-stat-card-value">
              Certificates
            </h3>
          </div>
        </div>
      </div>

      {/* =========================
          PARTICIPANT ACTIONS
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Access your most important hackathon activities.
            </p>
          </div>
        </div>

        <div className="dashboard-card-grid">
          <DashboardCard
            icon="👥"
            title="My Teams"
            description="Create a team, manage your team members and handle invitations."
            link="/my-teams"
            buttonText="View Teams"
          />

          <DashboardCard
            icon="💻"
            title="My Projects"
            description="Create, edit and submit your hackathon projects."
            link="/my-projects"
            buttonText="View Projects"
          />

          <DashboardCard
            icon="🗳️"
            title="My Votes"
            description="View your community voting activity."
            link="/my-votes"
            buttonText="View Votes"
          />

          <DashboardCard
            icon="🏆"
            title="My Certificates"
            description="View, verify and download your DOGFOOD certificates."
            link="/my-certificates"
            buttonText="View Certificates"
          />

          <DashboardCard
            icon="🎯"
            title="Explore Events"
            description="Discover available hackathons and event details."
            link="/events"
            buttonText="Explore Events"
          />

          <DashboardCard
            icon="👤"
            title="My Profile"
            description="View and update your participant profile."
            link="/profile"
            buttonText="Open Profile"
          />
        </div>
      </div>
    </div>
  );
}

export default ParticipantDashboard;