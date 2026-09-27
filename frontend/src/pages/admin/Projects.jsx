import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import projectService from "../../services/projectService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminProjects() {
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

      /*
        Admin backend endpoint may have a different
        method name depending on your projectService.
      */
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
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Manage Projects</h1>

          <p>
            View and monitor hackathon projects
            submitted on the DOGFOOD platform.
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

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <ErrorMessage message={error} />
      )}

      {/* =========================
          PROJECTS
      ========================= */}

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>All Projects</h2>

            <p>
              Total projects: {projects.length}
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects found</h3>

            <p>
              There are currently no projects available.
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

                  <Link
                    to={`/projects/${project._id}`}
                    className="btn btn-primary"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProjects;