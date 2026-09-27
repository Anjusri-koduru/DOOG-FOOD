import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import projectService from "../../services/projectService";
import commentService from "../../services/commentService";

import CommentList from "../../components/comments/CommentList";
import VoteButton from "../../components/voting/VoteButton";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [project, setProject] =
    useState(null);

  const [comments, setComments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [commentsLoading, setCommentsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [commentsError, setCommentsError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  // --------------------------------------------------
  // LOAD PROJECT
  // --------------------------------------------------

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await projectService.getProjectById(
          projectId
        );

      const projectData =
        response?.data?.project ||
        response?.data ||
        response?.project ||
        null;

      setProject(projectData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load project."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // LOAD COMMENTS
  // --------------------------------------------------

  useEffect(() => {
    if (projectId) {
      loadComments();
    }
  }, [projectId]);

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentsError("");

      const response =
        await commentService.getProjectComments(
          projectId
        );

      const commentData =
        response?.data?.comments ||
        response?.data ||
        response?.comments ||
        [];

      setComments(
        Array.isArray(commentData)
          ? commentData
          : []
      );
    } catch (err) {
      setCommentsError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load comments."
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  // --------------------------------------------------
  // CREATE COMMENT / REPLY
  // --------------------------------------------------

  const handleCreateComment = async (
    content,
    parentComment = null
  ) => {
    if (!content?.trim()) {
      return;
    }

    try {
      setActionLoading(true);
      setCommentsError("");

      const eventId =
        project?.event?._id ||
        project?.event ||
        null;

      await commentService.createComment({
        event: eventId,
        project: projectId,
        content: content.trim(),
        parentComment,
      });

      await loadComments();
    } catch (err) {
      setCommentsError(
        err.response?.data?.message ||
          err.message ||
          "Unable to post comment."
      );

      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // UPDATE COMMENT
  // --------------------------------------------------

  const handleUpdateComment = async (
    commentId,
    content
  ) => {
    if (!content?.trim()) {
      return;
    }

    try {
      setActionLoading(true);
      setCommentsError("");

      await commentService.updateComment(
        commentId,
        {
          content: content.trim(),
        }
      );

      await loadComments();
    } catch (err) {
      setCommentsError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update comment."
      );

      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // DELETE COMMENT
  // --------------------------------------------------

  const handleDeleteComment = async (
    commentId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this comment?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setCommentsError("");

      await commentService.deleteComment(
        commentId
      );

      await loadComments();
    } catch (err) {
      setCommentsError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete comment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // EDIT PROJECT
  // --------------------------------------------------

  const handleEdit = () => {
    navigate(
      `/projects/${projectId}/edit`
    );
  };

  // --------------------------------------------------
  // WITHDRAW PROJECT
  // --------------------------------------------------

  const handleWithdraw = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to withdraw this project?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await projectService.withdrawProject(
        projectId
      );

      await loadProject();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to withdraw project."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="loader-container page-loader">
        <div className="loader"></div>

        <p>
          Loading project...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // PROJECT NOT FOUND
  // --------------------------------------------------

  if (!project) {
    return (
      <div className="page-container">

        <div className="empty-state">

          <div className="empty-state-icon">
            🚀
          </div>

          <h2>
            Project not found
          </h2>

          <p>
            This project may have been
            deleted or you may not have
            access to it.
          </p>

          <Link
            to="/my-projects"
            className="primary-button"
          >
            Back to My Projects
          </Link>

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // PROJECT DATA
  // --------------------------------------------------

  const eventName =
    project.event?.title ||
    project.event?.name ||
    "Hackathon Event";

  const teamName =
    project.team?.name ||
    "Team";

  const trackName =
    project.track?.name ||
    "No Track";

  const technologies =
    Array.isArray(project.technologies)
      ? project.technologies
      : [];

  const screenshots =
    Array.isArray(project.screenshots)
      ? project.screenshots
      : [];

  const createdById =
    project.createdBy?._id ||
    project.createdBy;

  const currentUserId =
    user?._id ||
    user?.id;

  const isCreator =
    String(createdById) ===
    String(currentUserId);

  const canEdit =
    isCreator &&
    project.status === "draft";

  const canWithdraw =
    isCreator &&
    project.status === "submitted";

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const getStatusClass = () => {
    if (project.status === "submitted") {
      return "status-badge status-active";
    }

    if (project.status === "withdrawn") {
      return "status-badge status-inactive";
    }

    return "status-badge";
  };

  const getStatusText = () => {
    if (project.status === "submitted") {
      return "Submitted";
    }

    if (project.status === "withdrawn") {
      return "Withdrawn";
    }

    return "Draft";
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="page-container">

      {/* BACK */}

      <Link
        to="/my-projects"
        className="back-link"
      >
        ← Back to My Projects
      </Link>

      {/* HEADER */}

      <div className="project-detail-header">

        <div>

          <p className="page-eyebrow">
            PROJECT
          </p>

          <h1>
            {project.title}
          </h1>

          <p className="project-event-name">
            🎯 {eventName}
          </p>

        </div>

        <span
          className={getStatusClass()}
        >
          {getStatusText()}
        </span>

      </div>

      {/* ERROR */}

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {/* MAIN GRID */}

      <div className="project-detail-grid">

        {/* LEFT SIDE */}

        <div className="project-main-content">

          {/* DESCRIPTION */}

          <div className="module-form-card">

            <div className="card-header">

              <h2>
                Project Description
              </h2>

            </div>

            <div className="project-description">
              {project.description}
            </div>

          </div>

          {/* PROJECT INFORMATION */}

          <div className="module-form-card">

            <div className="card-header">

              <h2>
                Project Information
              </h2>

            </div>

            <div className="project-info-grid">

              <div className="project-info-item">

                <span className="project-info-label">
                  Team
                </span>

                <strong>
                  {teamName}
                </strong>

              </div>

              <div className="project-info-item">

                <span className="project-info-label">
                  Track
                </span>

                <strong>
                  {trackName}
                </strong>

              </div>

              <div className="project-info-item">

                <span className="project-info-label">
                  Status
                </span>

                <strong>
                  {getStatusText()}
                </strong>

              </div>

              {project.submittedAt && (
                <div className="project-info-item">

                  <span className="project-info-label">
                    Submitted At
                  </span>

                  <strong>
                    {new Date(
                      project.submittedAt
                    ).toLocaleString()}
                  </strong>

                </div>
              )}

            </div>

          </div>

          {/* TECHNOLOGIES */}

          <div className="module-form-card">

            <div className="card-header">

              <h2>
                Technologies
              </h2>

            </div>

            {technologies.length > 0 ? (
              <div className="technology-list">

                {technologies.map(
                  (
                    technology,
                    index
                  ) => (
                    <span
                      key={`${technology}-${index}`}
                      className="technology-tag"
                    >
                      {technology}
                    </span>
                  )
                )}

              </div>
            ) : (
              <p className="muted-text">
                No technologies added.
              </p>
            )}

          </div>

          {/* LINKS */}

          <div className="module-form-card">

            <div className="card-header">

              <h2>
                Project Links
              </h2>

            </div>

            <div className="project-links-list">

              {project.repositoryUrl && (
                <a
                  href={
                    project.repositoryUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="project-link-card"
                >

                  <span>
                    💻
                  </span>

                  <div>

                    <strong>
                      Source Code
                    </strong>

                    <small>
                      View Repository
                    </small>

                  </div>

                </a>
              )}

              {project.demoUrl && (
                <a
                  href={
                    project.demoUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="project-link-card"
                >

                  <span>
                    🌐
                  </span>

                  <div>

                    <strong>
                      Live Demo
                    </strong>

                    <small>
                      Open Demo
                    </small>

                  </div>

                </a>
              )}

              {project.videoUrl && (
                <a
                  href={
                    project.videoUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="project-link-card"
                >

                  <span>
                    🎥
                  </span>

                  <div>

                    <strong>
                      Demo Video
                    </strong>

                    <small>
                      Watch Video
                    </small>

                  </div>

                </a>
              )}

              {project.presentationUrl && (
                <a
                  href={
                    project.presentationUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="project-link-card"
                >

                  <span>
                    📊
                  </span>

                  <div>

                    <strong>
                      Presentation
                    </strong>

                    <small>
                      View Presentation
                    </small>

                  </div>

                </a>
              )}

              {!project.repositoryUrl &&
                !project.demoUrl &&
                !project.videoUrl &&
                !project.presentationUrl && (
                  <p className="muted-text">
                    No project links added.
                  </p>
                )}

            </div>

          </div>

          {/* SCREENSHOTS */}

          {screenshots.length > 0 && (
            <div className="module-form-card">

              <div className="card-header">

                <h2>
                  Screenshots
                </h2>

              </div>

              <div className="project-screenshot-grid">

                {screenshots.map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      className="project-screenshot"
                      key={`${image}-${index}`}
                    >

                      <img
                        src={image}
                        alt={`Project screenshot ${
                          index + 1
                        }`}
                      />

                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {/* =================================
              MODULE 13 - COMMUNITY VOTING
          ================================= */}

          <div className="module-form-card">

            <div className="card-header">

              <div>

                <h2>
                  Community Voting
                </h2>

                <p>
                  Support this project
                  with your vote.
                </p>

              </div>

            </div>

            <VoteButton
              projectId={projectId}
              disabled={
                project.status !==
                "submitted"
              }
            />

            {project.status !==
              "submitted" && (
              <p className="muted-text">
                Voting is available only
                for submitted projects.
              </p>
            )}

          </div>

          {/* =================================
              MODULE 12 - DISCUSSION
          ================================= */}

          <div className="module-form-card project-discussion-card">

            <div className="card-header">

              <div>

                <h2>
                  Discussion
                </h2>

                <p>
                  Ask questions, share
                  feedback, or discuss
                  this project.
                </p>

              </div>

              <span className="comment-count-badge">
                {comments.length}
              </span>

            </div>

            {commentsError && (
              <div className="form-error">
                {commentsError}
              </div>
            )}

            <div className="project-new-comment">

              <h3>
                Add a comment
              </h3>

              <CommentList
                comments={comments}
                currentUserId={
                  currentUserId
                }
                onCreateComment={
                  handleCreateComment
                }
                onUpdateComment={
                  handleUpdateComment
                }
                onDeleteComment={
                  handleDeleteComment
                }
                loading={
                  commentsLoading ||
                  actionLoading
                }
              />

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <div className="project-detail-sidebar">

          {/* ACTIONS */}

          {(canEdit ||
            canWithdraw) && (
            <div className="module-form-card">

              <div className="card-header">

                <h2>
                  Project Actions
                </h2>

                <p>
                  Manage your project.
                </p>

              </div>

              {canEdit && (
                <button
                  type="button"
                  className="primary-button full-width"
                  onClick={handleEdit}
                  disabled={
                    actionLoading
                  }
                >
                  ✏️ Edit Project
                </button>
              )}

              {canWithdraw && (
                <button
                  type="button"
                  className="danger-button full-width"
                  onClick={
                    handleWithdraw
                  }
                  disabled={
                    actionLoading
                  }
                >
                  {actionLoading
                    ? "Withdrawing..."
                    : "Withdraw Project"}
                </button>
              )}

            </div>
          )}

          {/* TEAM */}

          <div className="module-form-card">

            <div className="card-header">

              <h2>
                Team
              </h2>

            </div>

            <div className="project-sidebar-info">

              <div className="sidebar-info-row">

                <span>
                  👥
                </span>

                <div>

                  <small>
                    Team Name
                  </small>

                  <strong>
                    {teamName}
                  </strong>

                </div>

              </div>

            </div>

            {project.team?._id && (
              <Link
                to={`/teams/${project.team._id}`}
                className="secondary-button full-width"
              >
                View Team
              </Link>
            )}

          </div>

          {/* EVENT */}

          <div className="module-form-card">

            <div className="card-header">

              <h2>
                Hackathon
              </h2>

            </div>

            <div className="project-sidebar-info">

              <div className="sidebar-info-row">

                <span>
                  🎯
                </span>

                <div>

                  <small>
                    Event
                  </small>

                  <strong>
                    {eventName}
                  </strong>

                </div>

              </div>

            </div>

            {project.event?._id && (
              <Link
                to={`/events/${project.event._id}`}
                className="secondary-button full-width"
              >
                View Event
              </Link>
            )}

          </div>

          {/* PROJECT STATUS */}

          <div className="module-form-card">

            <div className="card-header">

              <h2>
                Submission Status
              </h2>

            </div>

            <div className="submission-status-box">

              <div
                className={
                  getStatusClass()
                }
              >
                {getStatusText()}
              </div>

              {project.status ===
                "submitted" &&
                project.submittedAt && (
                  <p>
                    Submitted on{" "}
                    {new Date(
                      project.submittedAt
                    ).toLocaleString()}
                  </p>
                )}

              {project.status ===
                "draft" && (
                <p>
                  Your project is
                  still a draft.
                </p>
              )}

              {project.status ===
                "withdrawn" && (
                <p>
                  This project has
                  been withdrawn.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProjectDetails;