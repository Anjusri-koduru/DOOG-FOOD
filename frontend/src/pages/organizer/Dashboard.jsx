import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DashboardCard from "../../components/dashboard/DashboardCard";

function OrganizerDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>
            Organizer Dashboard
          </h1>

          <p>
            Welcome, {user?.name || "Organizer"}.
            Manage your hackathon from one place.
          </p>
        </div>

        <Link
          to="/organizer/events/create"
          className="btn btn-primary"
        >
          Create Event
        </Link>
      </div>

      {/* =========================
          OVERVIEW
      ========================= */}

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            🎯
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Event Management
            </p>

            <h3 className="dashboard-stat-card-value">
              Events
            </h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            👨‍⚖️
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Judging
            </p>

            <h3 className="dashboard-stat-card-value">
              Judges
            </h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            📊
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Evaluation
            </p>

            <h3 className="dashboard-stat-card-value">
              Scores
            </h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            🏆
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Awards
            </p>

            <h3 className="dashboard-stat-card-value">
              Certificates
            </h3>
          </div>
        </div>
      </div>

      {/* =========================
          MANAGEMENT
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Hackathon Management</h2>

            <p>
              Manage events, tracks, prizes and participants.
            </p>
          </div>
        </div>

        <div className="dashboard-card-grid">
          <DashboardCard
            icon="🎯"
            title="Manage Events"
            description="Create, edit, publish and manage your hackathon events."
            link="/organizer/events"
            buttonText="Manage Events"
          />

          <DashboardCard
            icon="🛤️"
            title="Tracks"
            description="Manage hackathon tracks and categories."
            link="/organizer/tracks"
            buttonText="Manage Tracks"
          />

          <DashboardCard
            icon="🏆"
            title="Prizes"
            description="Create and manage prizes for your hackathon."
            link="/organizer/prizes"
            buttonText="Manage Prizes"
          />

          <DashboardCard
            icon="👥"
            title="Teams"
            description="View and manage participating teams."
            link="/organizer/teams"
            buttonText="View Teams"
          />

          <DashboardCard
            icon="💻"
            title="Projects"
            description="Review submitted hackathon projects."
            link="/organizer/projects"
            buttonText="View Projects"
          />
        </div>
      </div>

      {/* =========================
          JUDGING
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Judging & Evaluation</h2>

            <p>
              Configure judges, rubrics and project evaluation.
            </p>
          </div>
        </div>

        <div className="dashboard-card-grid">
          <DashboardCard
            icon="👨‍⚖️"
            title="Manage Judges"
            description="Assign judges to projects and manage judging assignments."
            link="/organizer/judges"
            buttonText="Manage Judges"
          />

          <DashboardCard
            icon="📋"
            title="Rubrics"
            description="Create and manage evaluation criteria."
            link="/organizer/rubrics"
            buttonText="Manage Rubrics"
          />

          <DashboardCard
            icon="📊"
            title="Scores"
            description="Review submitted judging scores."
            link="/organizer/scores"
            buttonText="View Scores"
          />

          <DashboardCard
            icon="📈"
            title="Normalization"
            description="Normalize scores and generate project rankings."
            link="/organizer/normalization"
            buttonText="Open Normalization"
          />

          <DashboardCard
            icon="🗳️"
            title="Voting Results"
            description="View community voting results for the event."
            link="/organizer/voting"
            buttonText="View Voting"
          />
        </div>
      </div>

      {/* =========================
          FINALIZATION
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Finalization</h2>

            <p>
              Complete certificates and review platform activity.
            </p>
          </div>
        </div>

        <div className="dashboard-card-grid">
          <DashboardCard
            icon="🏆"
            title="Certificates"
            description="Generate participation and winner certificates."
            link="/organizer/certificates"
            buttonText="Manage Certificates"
          />

          <DashboardCard
            icon="📝"
            title="Audit Logs"
            description="Review important platform activity and audit records."
            link="/organizer/audit-logs"
            buttonText="View Audit Logs"
          />

          <DashboardCard
            icon="👤"
            title="Profile"
            description="View and update your organizer profile."
            link="/profile"
            buttonText="Open Profile"
          />
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;