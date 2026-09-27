import { useState } from "react";
import { useNavigate } from "react-router-dom";

import eventService from "../../services/eventService";

const initialForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  registrationDeadline: "",
  submissionDeadline: "",
  mode: "online",
  location: "",
  rules: "",
  minTeamSize: 1,
  maxTeamSize: 4,
  tags: "",
};

function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Event title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Event description is required.");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Start date and end date are required.");
      return;
    }

    if (
      new Date(formData.startDate) >=
      new Date(formData.endDate)
    ) {
      setError("End date must be after start date.");
      return;
    }

    if (
      formData.registrationDeadline &&
      new Date(formData.registrationDeadline) >
        new Date(formData.startDate)
    ) {
      setError(
        "Registration deadline must be before or on the event start date."
      );
      return;
    }

    if (
      formData.submissionDeadline &&
      new Date(formData.submissionDeadline) >
        new Date(formData.endDate)
    ) {
      setError(
        "Submission deadline must be before or on the event end date."
      );
      return;
    }

    const minTeamSize = Number(formData.minTeamSize);
    const maxTeamSize = Number(formData.maxTeamSize);

    if (
      !Number.isInteger(minTeamSize) ||
      !Number.isInteger(maxTeamSize) ||
      minTeamSize < 1 ||
      maxTeamSize < 1
    ) {
      setError("Team size must be valid numbers.");
      return;
    }

    if (minTeamSize > maxTeamSize) {
      setError(
        "Minimum team size cannot be greater than maximum team size."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),

        startDate: formData.startDate,
        endDate: formData.endDate,

        registrationDeadline:
          formData.registrationDeadline || null,

        submissionDeadline:
          formData.submissionDeadline || null,

        mode: formData.mode,

        location: formData.location.trim(),

        rules: formData.rules.trim(),

        minTeamSize,
        maxTeamSize,

        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const response =
        await eventService.createEvent(payload);

      const createdEvent =
        response?.data?.event ||
        response?.event ||
        response?.data ||
        null;

      setSuccess("Event created successfully.");

      if (createdEvent?._id) {
        setTimeout(() => {
          navigate(
            `/organizer/events/${createdEvent._id}`
          );
        }, 700);
      } else {
        setTimeout(() => {
          navigate("/organizer/events");
        }, 700);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">
            ORGANIZER
          </p>

          <h1>Create Event</h1>

          <p>
            Create a new hackathon event for
            participants.
          </p>
        </div>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {success && (
        <div className="form-success">
          {success}
        </div>
      )}

      <form
        className="form-card"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="title">
            Event Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your hackathon"
            rows="5"
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="startDate">
              Start Date & Time
            </label>

            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">
              End Date & Time
            </label>

            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="registrationDeadline">
              Registration Deadline
            </label>

            <input
              id="registrationDeadline"
              name="registrationDeadline"
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="submissionDeadline">
              Submission Deadline
            </label>

            <input
              id="submissionDeadline"
              name="submissionDeadline"
              type="datetime-local"
              value={formData.submissionDeadline}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="mode">
              Mode
            </label>

            <select
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
            >
              <option value="online">
                Online
              </option>

              <option value="offline">
                Offline
              </option>

              <option value="hybrid">
                Hybrid
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Online / College / City"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="minTeamSize">
              Minimum Team Size
            </label>

            <input
              id="minTeamSize"
              name="minTeamSize"
              type="number"
              min="1"
              value={formData.minTeamSize}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxTeamSize">
              Maximum Team Size
            </label>

            <input
              id="maxTeamSize"
              name="maxTeamSize"
              type="number"
              min="1"
              value={formData.maxTeamSize}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">
            Tags
          </label>

          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="AI, Web, Blockchain"
          />

          <small>
            Separate multiple tags with commas.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="rules">
            Rules
          </label>

          <textarea
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            placeholder="Enter hackathon rules"
            rows="5"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate("/organizer/events")
            }
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;