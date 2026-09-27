import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DashboardCard from "../../components/dashboard/DashboardCard";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>
            Admin Dashboard
          </h1>

          <p>
            Welcome, {user?.name || "Administrator"}.
            Manage and monitor the DOGFOOD platform.
          </p>
        </div>
      </div>

      {/* =========================
          ADMIN OVERVIEW
      ========================= */}

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            👥
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Platform
            </p>

            <h3 className="dashboard-stat-card-value">
              Users
            </h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-card-icon">
            🎯
          </div>

          <div className="dashboard-stat-card-content">
            <p className="dashboard-stat-card-title">
              Platform
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
              Evaluation
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
              Platform
            </p>

            <h3 className="dashboard-stat-card-value">
              Projects
            </h3>
          </div>
        </div>
      </div>

      {/* =========================
          USER MANAGEMENT
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>User Management</h2>

            <p>
              Manage platform users and judging roles.
            </p>
          </div>
        </div>

        <div className="dashboard-card-grid">
          <DashboardCard
            icon="👥"
            title="Users"
            description="View and manage registered DOGFOOD users."
            link="/admin/users"
            buttonText="Manage Users"
          />

          <DashboardCard
            icon="👨‍⚖️"
            title="Judges"
            description="Manage judge accounts and judging access."
            link="/admin/judges"
            buttonText="Manage Judges"
          />
        </div>
      </div>

      {/* =========================
          EVENT MANAGEMENT
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Platform Management</h2>

            <p>
              Monitor events and submitted projects.
            </p>
          </div>
        </div>

        <div className="dashboard-card-grid">
          <DashboardCard
            icon="🎯"
            title="Events"
            description="View and manage hackathon events across the platform."
            link="/admin/events"
            buttonText="Manage Events"
          />

          <DashboardCard
            icon="💻"
            title="Projects"
            description="Review projects submitted to the platform."
            link="/admin/projects"
            buttonText="View Projects"
          />

          <DashboardCard
            icon="📝"
            title="Audit Logs"
            description="Monitor important administrative and platform actions."
            link="/admin/audit-logs"
            buttonText="View Audit Logs"
          />

          <DashboardCard
            icon="🏆"
            title="Certificates"
            description="Review and manage generated certificates."
            link="/admin/certificates"
            buttonText="Manage Certificates"
          />
        </div>
      </div>

      {/* =========================
          ADMIN PROFILE
      ========================= */}

      <div className="dashboard-section">
        <div className="dashboard-card-grid">
          <DashboardCard
            icon="👤"
            title="My Profile"
            description="View and update your administrator profile."
            link="/profile"
            buttonText="Open Profile"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;