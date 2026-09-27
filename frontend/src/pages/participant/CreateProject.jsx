import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import projectService from "../../services/projectService";
import ProjectForm from "../../components/projects/ProjectForm";

function CreateProject() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleCreate = async (
    projectData
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await projectService.createProject(
          projectData
        );

      const project =
        response?.data?.project ||
        response?.project ||
        response?.data ||
        null;

      const projectId =
        project?._id ||
        project?.id;

      if (projectId) {
        navigate(
          `/projects/${projectId}`
        );
      } else {
        navigate("/my-projects");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create project."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <Link
        to="/my-projects"
        className="back-link"
      >
        ← Back to My Projects
      </Link>

      <div className="page-header">
        <p className="page-eyebrow">
          PROJECTS
        </p>

        <h1>Create Project</h1>

        <p>
          Add your project details and save
          it as a draft.
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
            Project Information
          </h2>

          <p>
            You can edit your project before
            submitting it.
          </p>
        </div>

        <ProjectForm
          onSubmit={handleCreate}
          loading={loading}
          submitLabel="Create Project"
        />
      </div>

    </div>
  );
}

export default CreateProject;