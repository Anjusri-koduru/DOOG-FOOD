import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import projectService from "../../services/projectService";
import ProjectCard from "../../components/projects/ProjectCard";

function MyProjects() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await projectService.getMyProjects();

      const projectList =
        response?.data?.projects ||
        response?.data ||
        response?.projects ||
        [];

      setProjects(
        Array.isArray(projectList)
          ? projectList
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header project-page-header">
        <div>
          <p className="page-eyebrow">
            PARTICIPANT
          </p>

          <h1>My Projects</h1>

          <p>
            Create, manage and submit your
            hackathon projects.
          </p>
        </div>

        <Link
          to="/projects/create"
          className="primary-button"
        >
          + Create Project
        </Link>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>

          <p>
            Loading your projects...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            🚀
          </div>

          <h3>
            No projects yet
          </h3>

          <p>
            Create your first project and
            submit it for judging.
          </p>

          <Link
            to="/projects/create"
            className="primary-button"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default MyProjects;