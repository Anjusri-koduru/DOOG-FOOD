import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import teamService from "../../services/teamService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await teamService.getAllTeams();

      const data =
        response?.data?.teams ||
        response?.data ||
        response?.teams ||
        [];

      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load teams."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Manage Teams</h1>

          <p>
            View and monitor teams participating
            in DOGFOOD hackathons.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadTeams}
        >
          Refresh
        </button>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <ErrorMessage message={error} />
      )}

      {/* =========================
          TEAM SECTION
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>All Teams</h2>

            <p>
              Total Teams: {teams.length}
            </p>
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="empty-state">
            <h3>No teams found</h3>

            <p>
              No teams are currently available.
            </p>
          </div>
        ) : (
          <div className="dashboard-card-grid">
            {teams.map((team) => (
              <div
                key={team._id}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">
                  👥
                </div>

                <div className="dashboard-card-content">
                  <h3>
                    {team.name || "Unnamed Team"}
                  </h3>

                  {team.event?.title && (
                    <p>
                      <strong>Event:</strong>{" "}
                      {team.event.title}
                    </p>
                  )}

                  {team.leader?.name && (
                    <p>
                      <strong>Leader:</strong>{" "}
                      {team.leader.name}
                    </p>
                  )}

                  {team.members && (
                    <p>
                      <strong>Members:</strong>{" "}
                      {Array.isArray(team.members)
                        ? team.members.length
                        : 0}
                    </p>
                  )}

                  <p>
                    <strong>Status:</strong>{" "}
                    {team.status || "active"}
                  </p>

                  <div
                    style={{
                      marginTop: "12px",
                    }}
                  >
                    <Link
                      to={`/teams/${team._id}`}
                      className="btn btn-primary"
                    >
                      View Team
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageTeams;