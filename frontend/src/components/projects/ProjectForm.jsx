import { useEffect, useState } from "react";

function ProjectForm({
  initialData,
  tracks = [],
  onSubmit,
  loading = false,
  submitLabel = "Save Project",
}) {
  const [formData, setFormData] =
    useState({
      event: "",
      team: "",
      track: "",
      title: "",
      description: "",
      technologies: "",
      repositoryUrl: "",
      demoUrl: "",
      videoUrl: "",
      presentationUrl: "",
      screenshots: "",
    });

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setFormData({
      event:
        initialData.event?._id ||
        initialData.event ||
        "",

      team:
        initialData.team?._id ||
        initialData.team ||
        "",

      track:
        initialData.track?._id ||
        initialData.track ||
        "",

      title:
        initialData.title || "",

      description:
        initialData.description || "",

      technologies:
        Array.isArray(
          initialData.technologies
        )
          ? initialData.technologies.join(", ")
          : "",

      repositoryUrl:
        initialData.repositoryUrl || "",

      demoUrl:
        initialData.demoUrl || "",

      videoUrl:
        initialData.videoUrl || "",

      presentationUrl:
        initialData.presentationUrl || "",

      screenshots:
        Array.isArray(
          initialData.screenshots
        )
          ? initialData.screenshots.join("\n")
          : "",
    });
  }, [initialData]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.event.trim()) {
      setError("Event ID is required.");
      return;
    }

    if (!formData.team.trim()) {
      setError("Team ID is required.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (
      formData.description.trim().length <
      20
    ) {
      setError(
        "Project description must contain at least 20 characters."
      );
      return;
    }

    const technologies =
      formData.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const screenshots =
      formData.screenshots
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

    const payload = {
      event: formData.event.trim(),
      team: formData.team.trim(),
      track:
        formData.track.trim() || null,
      title: formData.title.trim(),
      description:
        formData.description.trim(),
      technologies,
      repositoryUrl:
        formData.repositoryUrl.trim(),
      demoUrl:
        formData.demoUrl.trim(),
      videoUrl:
        formData.videoUrl.trim(),
      presentationUrl:
        formData.presentationUrl.trim(),
      screenshots,
    };

    try {
      setError("");
      await onSubmit(payload);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save project."
      );
    }
  };

  return (
    <form
      className="module-form project-form"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="project-event">
          Event ID *
        </label>

        <input
          id="project-event"
          name="event"
          value={formData.event}
          onChange={handleChange}
          placeholder="Enter event ID"
          required
          disabled={Boolean(initialData)}
        />

        <small className="form-help">
          Enter the MongoDB Event ID.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="project-team">
          Team ID *
        </label>

        <input
          id="project-team"
          name="team"
          value={formData.team}
          onChange={handleChange}
          placeholder="Enter team ID"
          required
          disabled={Boolean(initialData)}
        />

        <small className="form-help">
          Enter the team ID that will submit
          this project.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="project-track">
          Track
        </label>

        {tracks.length > 0 ? (
          <select
            id="project-track"
            name="track"
            value={formData.track}
            onChange={handleChange}
          >
            <option value="">
              Select a track
            </option>

            {tracks.map((track) => (
              <option
                key={track._id}
                value={track._id}
              >
                {track.name ||
                  track.title}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="project-track"
            name="track"
            value={formData.track}
            onChange={handleChange}
            placeholder="Track ID (optional)"
          />
        )}
      </div>

      <div className="form-group">
        <label htmlFor="project-title">
          Project Title *
        </label>

        <input
          id="project-title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Example: Smart Village"
          maxLength={200}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="project-description">
          Description *
        </label>

        <textarea
          id="project-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Explain your project..."
          rows={7}
          minLength={20}
          maxLength={10000}
          required
        />

        <small className="form-help">
          Minimum 20 characters.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="project-technologies">
          Technologies
        </label>

        <input
          id="project-technologies"
          name="technologies"
          value={
            formData.technologies
          }
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
        />

        <small className="form-help">
          Separate technologies with commas.
        </small>
      </div>

      <div className="project-links-grid">

        <div className="form-group">
          <label htmlFor="repositoryUrl">
            Repository URL
          </label>

          <input
            id="repositoryUrl"
            name="repositoryUrl"
            value={
              formData.repositoryUrl
            }
            onChange={handleChange}
            placeholder="https://github.com/..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="demoUrl">
            Demo URL
          </label>

          <input
            id="demoUrl"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="videoUrl">
            Video URL
          </label>

          <input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="presentationUrl">
            Presentation URL
          </label>

          <input
            id="presentationUrl"
            name="presentationUrl"
            value={
              formData.presentationUrl
            }
            onChange={handleChange}
            placeholder="https://drive.google.com/..."
          />
        </div>

      </div>

      <div className="form-group">
        <label htmlFor="screenshots">
          Screenshot URLs
        </label>

        <textarea
          id="screenshots"
          name="screenshots"
          value={
            formData.screenshots
          }
          onChange={handleChange}
          placeholder={
            "https://image1.jpg\nhttps://image2.jpg"
          }
          rows={4}
        />

        <small className="form-help">
          Enter one screenshot URL per line.
        </small>
      </div>

      <div className="form-action-row">
        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;