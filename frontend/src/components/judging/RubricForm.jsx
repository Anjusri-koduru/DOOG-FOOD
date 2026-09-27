import { useEffect, useState } from "react";

function RubricForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [event, setEvent] = useState("");
  const [track, setTrack] = useState("");
  const [criteria, setCriteria] = useState([
    {
      name: "",
      description: "",
      maxScore: 100,
      weight: 100,
    },
  ]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");

      setEvent(
        typeof initialData.event === "object"
          ? initialData.event?._id || ""
          : initialData.event || ""
      );

      setTrack(
        typeof initialData.track === "object"
          ? initialData.track?._id || ""
          : initialData.track || ""
      );

      if (
        Array.isArray(initialData.criteria) &&
        initialData.criteria.length > 0
      ) {
        setCriteria(
          initialData.criteria.map((item) => ({
            name: item.name || "",
            description: item.description || "",
            maxScore:
              item.maxScore !== undefined
                ? item.maxScore
                : 100,
            weight:
              item.weight !== undefined
                ? item.weight
                : 0,
          }))
        );
      }
    }
  }, [initialData]);

  const updateCriterion = (
    index,
    field,
    value
  ) => {
    setCriteria((previous) =>
      previous.map((criterion, criterionIndex) =>
        criterionIndex === index
          ? {
              ...criterion,
              [field]:
                field === "maxScore" ||
                field === "weight"
                  ? Number(value)
                  : value,
            }
          : criterion
      )
    );
  };

  const addCriterion = () => {
    setCriteria((previous) => [
      ...previous,
      {
        name: "",
        description: "",
        maxScore: 100,
        weight: 0,
      },
    ]);
  };

  const removeCriterion = (index) => {
    if (criteria.length === 1) {
      return;
    }

    setCriteria((previous) =>
      previous.filter(
        (_, criterionIndex) =>
          criterionIndex !== index
      )
    );
  };

  const totalWeight = criteria.reduce(
    (total, criterion) =>
      total + Number(criterion.weight || 0),
    0
  );

  const handleSubmit = async (eventObject) => {
    eventObject.preventDefault();

    if (!name.trim()) {
      alert("Please enter rubric name.");
      return;
    }

    if (!event.trim()) {
      alert("Please enter Event ID.");
      return;
    }

    if (criteria.length === 0) {
      alert("Please add at least one criterion.");
      return;
    }

    const hasInvalidCriteria = criteria.some(
      (criterion) =>
        !criterion.name.trim() ||
        Number(criterion.maxScore) <= 0 ||
        Number(criterion.weight) <= 0
    );

    if (hasInvalidCriteria) {
      alert(
        "Please complete all criteria correctly."
      );
      return;
    }

    if (totalWeight !== 100) {
      alert(
        `Criteria weights must total 100%. Current total: ${totalWeight}%`
      );
      return;
    }

    const payload = {
      event: event.trim(),
      name: name.trim(),
      description: description.trim(),
      criteria: criteria.map((criterion) => ({
        name: criterion.name.trim(),
        description:
          criterion.description.trim(),
        maxScore: Number(criterion.maxScore),
        weight: Number(criterion.weight),
      })),
    };

    if (track.trim()) {
      payload.track = track.trim();
    } else {
      payload.track = null;
    }

    await onSubmit(payload);
  };

  return (
    <form
      className="rubric-form"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label htmlFor="rubric-name">
          Rubric Name
        </label>

        <input
          id="rubric-name"
          type="text"
          value={name}
          onChange={(eventObject) =>
            setName(eventObject.target.value)
          }
          placeholder="Example: Hackathon Final Evaluation"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="rubric-event">
          Event ID
        </label>

        <input
          id="rubric-event"
          type="text"
          value={event}
          onChange={(eventObject) =>
            setEvent(eventObject.target.value)
          }
          placeholder="Enter Event ID"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="rubric-track">
          Track ID
        </label>

        <input
          id="rubric-track"
          type="text"
          value={track}
          onChange={(eventObject) =>
            setTrack(eventObject.target.value)
          }
          placeholder="Optional - leave empty for all tracks"
        />
      </div>

      <div className="form-group">
        <label htmlFor="rubric-description">
          Description
        </label>

        <textarea
          id="rubric-description"
          value={description}
          onChange={(eventObject) =>
            setDescription(
              eventObject.target.value
            )
          }
          placeholder="Explain how judges should use this rubric."
          rows={4}
        />
      </div>

      <div className="rubric-criteria-section">

        <div className="rubric-section-header">
          <div>
            <h3>Evaluation Criteria</h3>

            <p>
              Add criteria and assign percentage weights.
            </p>
          </div>

          <div
            className={
              totalWeight === 100
                ? "weight-total valid"
                : "weight-total invalid"
            }
          >
            Total Weight: {totalWeight}%
          </div>
        </div>

        <div className="criteria-list">

          {criteria.map(
            (criterion, index) => (
              <div
                className="criterion-form-card"
                key={index}
              >
                <div className="criterion-header">
                  <h4>
                    Criterion {index + 1}
                  </h4>

                  {criteria.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() =>
                        removeCriterion(index)
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="criterion-grid">

                  <div className="form-group">
                    <label>
                      Criterion Name
                    </label>

                    <input
                      type="text"
                      value={criterion.name}
                      onChange={(eventObject) =>
                        updateCriterion(
                          index,
                          "name",
                          eventObject.target.value
                        )
                      }
                      placeholder="Example: Innovation"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Max Score
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={criterion.maxScore}
                      onChange={(eventObject) =>
                        updateCriterion(
                          index,
                          "maxScore",
                          eventObject.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Weight (%)
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={criterion.weight}
                      onChange={(eventObject) =>
                        updateCriterion(
                          index,
                          "weight",
                          eventObject.target.value
                        )
                      }
                      required
                    />
                  </div>

                </div>

                <div className="form-group">
                  <label>
                    Criterion Description
                  </label>

                  <textarea
                    value={
                      criterion.description
                    }
                    onChange={(eventObject) =>
                      updateCriterion(
                        index,
                        "description",
                        eventObject.target.value
                      )
                    }
                    placeholder="Explain what the judge should evaluate..."
                    rows={3}
                  />
                </div>

              </div>
            )
          )}

        </div>

        <button
          type="button"
          className="btn btn-secondary add-criterion-button"
          onClick={addCriterion}
        >
          + Add Criterion
        </button>

      </div>

      <div className="rubric-form-actions">

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Rubric"
            : "Create Rubric"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}

      </div>
    </form>
  );
}

export default RubricForm;