import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import projectService from "../../services/projectService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await projectService.getAllProjects();

      const data =
        response?.data?.projects ||
        response?.data ||
        response?.projects ||
        [];

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load projects."
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
      <div className="page-header">
        <div>
          <h1>Manage Projects</h1>

          <p>
            View and manage hackathon projects submitted
            by participating teams.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadProjects}
        >
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>All Projects</h2>

            <p>
              Total Projects: {projects.length}
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects found</h3>

            <p>
              No projects have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="dashboard-card-grid">
            {projects.map((project) => (
              <div
                key={project._id}
                className="dashboard-card"
              >
                <div className="dashboard-card-icon">
                  💻
                </div>

                <div className="dashboard-card-content">
                  <h3>
                    {project.title ||
                      "Untitled Project"}
                  </h3>

                  <p>
                    {project.description
                      ? project.description.length > 150
                        ? `${project.description.slice(
                            0,
                            150
                          )}...`
                        : project.description
                      : "No description available."}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {project.status || "Unknown"}
                  </p>

                  {project.event?.title && (
                    <p>
                      <strong>Event:</strong>{" "}
                      {project.event.title}
                    </p>
                  )}

                  {project.team?.name && (
                    <p>
                      <strong>Team:</strong>{" "}
                      {project.team.name}
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: "12px",
                    }}
                  >
                    <Link
                      to={`/projects/${project._id}`}
                      className="btn btn-primary"
                    >
                      View Project
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

export default ManageProjects;