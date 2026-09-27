import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import projectService from "../../services/projectService";
import ProjectForm from "../../components/projects/ProjectForm";

function EditProject() {
  const { projectId } =
    useParams();

  const navigate = useNavigate();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

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

  const handleUpdate = async (
    projectData
  ) => {
    try {
      setSaving(true);
      setError("");

      await projectService.updateProject(
        projectId,
        projectData
      );

      navigate(
        `/projects/${projectId}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update project."
      );

      throw err;
    } finally {
      setSaving(false);
    }
  };

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

  if (!project) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>
            Project not found
          </h2>

          <p>
            Unable to find this project.
          </p>

          <Link
            to="/my-projects"
            className="primary-button"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (project.status !== "draft") {
    return (
      <div className="page-container">

        <div className="empty-state">
          <div className="empty-state-icon">
            🔒
          </div>

          <h2>
            Project Cannot Be Edited
          </h2>

          <p>
            Only draft projects can be
            edited.
          </p>

          <Link
            to={`/projects/${projectId}`}
            className="primary-button"
          >
            View Project
          </Link>
        </div>

      </div>
    );
  }

  return (
    <div className="page-container">

      <Link
        to={`/projects/${projectId}`}
        className="back-link"
      >
        ← Back to Project
      </Link>

      <div className="page-header">
        <p className="page-eyebrow">
          PROJECTS
        </p>

        <h1>
          Edit Project
        </h1>

        <p>
          Update your project before
          submitting it.
        </p>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="module-form-card project-form-container">

        <div className="card-header">
          <h2>
            {project.title}
          </h2>

          <p>
            Update your project information.
          </p>
        </div>

        <ProjectForm
          initialData={project}
          onSubmit={handleUpdate}
          loading={saving}
          submitLabel="Update Project"
        />

      </div>

    </div>
  );
}

export default EditProject;