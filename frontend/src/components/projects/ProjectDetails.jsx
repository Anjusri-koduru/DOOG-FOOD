import ProjectStatusBadge from "./ProjectStatusBadge";

function ProjectDetails({
  project,
  onSubmit,
  onWithdraw,
  submitting = false,
}) {
  if (!project) {
    return null;
  }

  const technologies =
    Array.isArray(project.technologies)
      ? project.technologies
      : [];

  const screenshots =
    Array.isArray(project.screenshots)
      ? project.screenshots
      : [];

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

  const isDraft =
    project.status === "draft";

  const isSubmitted =
    project.status === "submitted";

  const isWithdrawn =
    project.status === "withdrawn";

  return (
    <div className="project-details">

      <div className="project-detail-top">
        <div>
          <p className="page-eyebrow">
            PROJECT
          </p>

          <h1>{project.title}</h1>

          <p className="project-event-name">
            🎯 {eventName}
          </p>
        </div>

        <ProjectStatusBadge
          status={project.status}
        />
      </div>

      <div className="project-detail-info-grid">

        <div>
          <span>Team</span>
          <strong>{teamName}</strong>
        </div>

        <div>
          <span>Track</span>
          <strong>{trackName}</strong>
        </div>

        <div>
          <span>Created</span>
          <strong>
            {project.createdAt
              ? new Date(
                  project.createdAt
                ).toLocaleDateString()
              : "-"}
          </strong>
        </div>

        <div>
          <span>Submitted</span>
          <strong>
            {project.submittedAt
              ? new Date(
                  project.submittedAt
                ).toLocaleDateString()
              : "Not submitted"}
          </strong>
        </div>

      </div>

      <div className="project-detail-section">
        <h2>Description</h2>

        <p className="project-full-description">
          {project.description}
        </p>
      </div>

      {technologies.length > 0 && (
        <div className="project-detail-section">
          <h2>Technologies</h2>

          <div className="technology-tags large-tags">
            {technologies.map(
              (technology, index) => (
                <span
                  key={`${technology}-${index}`}
                >
                  {technology}
                </span>
              )
            )}
          </div>
        </div>
      )}

      <div className="project-detail-section">
        <h2>Project Links</h2>

        <div className="project-link-list">

          {project.repositoryUrl && (
            <a
              href={
                project.repositoryUrl
              }
              target="_blank"
              rel="noreferrer"
              className="project-external-link"
            >
              💻 Repository
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="project-external-link"
            >
              🌐 Live Demo
            </a>
          )}

          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="project-external-link"
            >
              🎥 Demo Video
            </a>
          )}

          {project.presentationUrl && (
            <a
              href={
                project.presentationUrl
              }
              target="_blank"
              rel="noreferrer"
              className="project-external-link"
            >
              📊 Presentation
            </a>
          )}

        </div>
      </div>

      {screenshots.length > 0 && (
        <div className="project-detail-section">
          <h2>Screenshots</h2>

          <div className="project-screenshot-grid">
            {screenshots.map(
              (imageUrl, index) => (
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  key={`${imageUrl}-${index}`}
                >
                  <img
                    src={imageUrl}
                    alt={`Project screenshot ${
                      index + 1
                    }`}
                  />
                </a>
              )
            )}
          </div>
        </div>
      )}

      {(isDraft || isSubmitted) && (
        <div className="project-actions">

          {isDraft && onSubmit && (
            <button
              type="button"
              className="primary-button"
              disabled={submitting}
              onClick={onSubmit}
            >
              {submitting
                ? "Submitting..."
                : "Submit Project"}
            </button>
          )}

          {isSubmitted &&
            onWithdraw && (
              <button
                type="button"
                className="danger-button"
                disabled={submitting}
                onClick={onWithdraw}
              >
                {submitting
                  ? "Processing..."
                  : "Withdraw Project"}
              </button>
            )}

        </div>
      )}

      {isWithdrawn && (
        <div className="project-withdrawn-message">
          This project has been withdrawn.
        </div>
      )}

    </div>
  );
}

export default ProjectDetails;