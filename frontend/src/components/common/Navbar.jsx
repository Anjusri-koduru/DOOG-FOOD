import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const role = user?.role;

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="navbar-brand"
        >
          <span className="brand-logo">
            🐶
          </span>

          <span>DOGFOOD</span>
        </Link>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="navbar-links">

          {/* =========================
              PUBLIC LINKS
          ========================= */}

          <Link to="/">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>

          <Link to="/events">
            <span className="nav-icon">📅</span>
            <span>Events</span>
          </Link>


          {isAuthenticated ? (
            <>

              {/* =========================
                  COMMON DASHBOARD
              ========================= */}

              <Link to="/dashboard">
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </Link>


              {/* =========================
                  PARTICIPANT
              ========================= */}

              {role === "participant" && (
                <>
                  <Link to="/my-teams">
                    <span className="nav-icon">👥</span>
                    <span>My Teams</span>
                  </Link>

                  <Link to="/my-projects">
                    <span className="nav-icon">💻</span>
                    <span>My Projects</span>
                  </Link>

                  <Link to="/my-votes">
                    <span className="nav-icon">🗳️</span>
                    <span>My Votes</span>
                  </Link>

                  <Link to="/my-certificates">
                    <span className="nav-icon">🏆</span>
                    <span>My Certificates</span>
                  </Link>
                </>
              )}


              {/* =========================
                  JUDGE
              ========================= */}

              {role === "judge" && (
                <>
                  <Link to="/judge/dashboard">
                    <span className="nav-icon">⚖️</span>
                    <span>Judge Dashboard</span>
                  </Link>

                  <Link to="/judge/assignments">
                    <span className="nav-icon">📋</span>
                    <span>My Assignments</span>
                  </Link>

                  <Link to="/judge/scores">
                    <span className="nav-icon">⭐</span>
                    <span>My Scores</span>
                  </Link>
                </>
              )}


              {/* =========================
                  ORGANIZER
              ========================= */}

              {role === "organizer" && (
                <>
                  <Link to="/organizer/dashboard">
                    <span className="nav-icon">🎯</span>
                    <span>Organizer</span>
                  </Link>

                  <Link to="/organizer/events">
                    <span className="nav-icon">📅</span>
                    <span>Manage Events</span>
                  </Link>

                  <Link to="/organizer/judges">
                    <span className="nav-icon">⚖️</span>
                    <span>Manage Judges</span>
                  </Link>

                  <Link to="/organizer/rubrics">
                    <span className="nav-icon">📝</span>
                    <span>Manage Rubrics</span>
                  </Link>

                  <Link to="/organizer/voting">
                    <span className="nav-icon">🗳️</span>
                    <span>Voting Results</span>
                  </Link>

                  <Link to="/organizer/audit-logs">
                    <span className="nav-icon">📜</span>
                    <span>Audit Logs</span>
                  </Link>

                  <Link to="/organizer/certificates">
                    <span className="nav-icon">🏆</span>
                    <span>Certificates</span>
                  </Link>
                </>
              )}


              {/* =========================
                  ADMIN
              ========================= */}

              {role === "admin" && (
                <>
                  <Link to="/admin/dashboard">
                    <span className="nav-icon">🛡️</span>
                    <span>Admin</span>
                  </Link>

                  <Link to="/admin/users">
                    <span className="nav-icon">👥</span>
                    <span>Users</span>
                  </Link>

                  <Link to="/admin/events">
                    <span className="nav-icon">📅</span>
                    <span>Events</span>
                  </Link>

                  <Link to="/admin/judges">
                    <span className="nav-icon">⚖️</span>
                    <span>Judges</span>
                  </Link>

                  <Link to="/admin/projects">
                    <span className="nav-icon">💻</span>
                    <span>Projects</span>
                  </Link>

                  <Link to="/organizer/rubrics">
                    <span className="nav-icon">📝</span>
                    <span>Rubrics</span>
                  </Link>

                  <Link to="/organizer/voting">
                    <span className="nav-icon">🗳️</span>
                    <span>Voting Results</span>
                  </Link>

                  <Link to="/admin/audit-logs">
                    <span className="nav-icon">📜</span>
                    <span>Audit Logs</span>
                  </Link>

                  <Link to="/admin/certificates">
                    <span className="nav-icon">🏆</span>
                    <span>Certificates</span>
                  </Link>
                </>
              )}


              {/* =========================
                  PROFILE
              ========================= */}

              <Link to="/profile">
                <span className="nav-icon">👤</span>
                <span>{user?.name || "Profile"}</span>
              </Link>


              {/* =========================
                  LOGOUT
              ========================= */}

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                <span className="nav-icon">🚪</span>
                <span>Logout</span>
              </button>

            </>
          ) : (
            <>
              {/* =========================
                  GUEST
              ========================= */}

              <Link to="/login">
                <span className="nav-icon">🔐</span>
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="navbar-register"
              >
                <span className="nav-icon">📝</span>
                <span>Register</span>
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}

export default Navbar;