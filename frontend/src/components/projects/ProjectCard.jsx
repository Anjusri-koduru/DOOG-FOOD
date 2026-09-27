import { Link } from "react-router-dom";

import ProjectStatusBadge from "./ProjectStatusBadge";

function ProjectCard({ project }) {
  if (!project) {
    return null;
  }

  const projectId =
    project._id || project.id;

  const eventName =
    project.event?.title ||
    project.event?.name ||
    "Hackathon Event";

  const teamName =
    project.team?.name ||
    "Team";

  const trackName =
    project.track?.name ||
    project.track?.title ||
    "No track selected";

  const technologies =
    Array.isArray(project.technologies)
      ? project.technologies
      : [];

  return (
    <div className="project-card">

      <div className="project-card-top">
        <div className="project-icon">
          🚀
        </div>

        <ProjectStatusBadge
          status={project.status}
        />
      </div>

      <h3>
        {project.title || "Untitled Project"}
      </h3>

      <p className="project-description">
        {project.description ||
          "No project description available."}
      </p>

      <div className="project-meta-list">

        <div>
          <span>🎯 Event</span>
          <strong>{eventName}</strong>
        </div>

        <div>
          <span>👥 Team</span>
          <strong>{teamName}</strong>
        </div>

        <div>
          <span>🏷️ Track</span>
          <strong>{trackName}</strong>
        </div>

      </div>

      {technologies.length > 0 && (
        <div className="technology-tags">
          {technologies
            .slice(0, 5)
            .map((technology, index) => (
              <span
                key={`${technology}-${index}`}
              >
                {technology}
              </span>
            ))}
        </div>
      )}

      <Link
        to={`/projects/${projectId}`}
        className="primary-button project-view-button"
      >
        View Project
      </Link>

    </div>
  );
}

export default ProjectCard;