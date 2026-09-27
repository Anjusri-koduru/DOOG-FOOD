import { useEffect, useMemo, useState } from "react";
import scoreService from "../../services/scoreService";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

function ScoreForm({
  project,
  rubric,
  assignment,
  onSuccess,
}) {
  const [criteriaScores, setCriteriaScores] = useState([]);
  const [overallComment, setOverallComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
    Load existing score if judge has already submitted one.
  */
  useEffect(() => {
    const loadExistingScore = async () => {
      try {
        setChecking(true);
        setError("");

        const response =
          await scoreService.getMyProjectScores(
            project._id
          );

        const scores =
          response?.data?.scores ||
          response?.scores ||
          response?.data ||
          [];

        if (Array.isArray(scores) && scores.length > 0) {
          const existing = scores.find(
            (item) =>
              String(item.rubric?._id || item.rubric) ===
              String(rubric?._id)
          );

          if (existing) {
            setCriteriaScores(
              existing.criteriaScores || []
            );

            setOverallComment(
              existing.overallComment || ""
            );
          }
        }
      } catch (err) {
        /*
          404 / empty response should not stop
          the judge from entering a new score.
        */
        console.log(
          "No existing score found."
        );
      } finally {
        setChecking(false);
      }
    };

    if (project?._id && rubric?._id) {
      loadExistingScore();
    } else {
      setChecking(false);
    }
  }, [project, rubric]);

  /*
    Prepare criteria whenever rubric changes.
  */
  useEffect(() => {
    if (!rubric?.criteria) {
      return;
    }

    setCriteriaScores((current) => {
      return rubric.criteria.map(
        (criterion, index) => {
          const existing =
            current.find(
              (item) =>
                String(item.criterionId) ===
                String(
                  criterion._id || criterion.id
                )
            );

          return {
            criterionId:
              criterion._id ||
              criterion.id ||
              `criterion-${index}`,

            name: criterion.name,

            score:
              existing?.score !== undefined
                ? existing.score
                : "",

            maxScore:
              Number(criterion.maxScore) || 0,

            weight:
              Number(criterion.weight) || 0,

            weightedScore:
              existing?.weightedScore || 0,

            comment:
              existing?.comment || "",
          };
        }
      );
    });
  }, [rubric]);

  /*
    Calculate total weighted score.
  */
  const totalScore = useMemo(() => {
    return criteriaScores.reduce(
      (total, criterion) => {
        const score = Number(
          criterion.score
        );

        const maxScore = Number(
          criterion.maxScore
        );

        const weight = Number(
          criterion.weight
        );

        if (
          !Number.isFinite(score) ||
          !Number.isFinite(maxScore) ||
          maxScore <= 0
        ) {
          return total;
        }

        const weighted =
          (score / maxScore) * weight;

        return total + weighted;
      },
      0
    );
  }, [criteriaScores]);

  /*
    Update criterion score.
  */
  const handleScoreChange = (
    criterionId,
    value
  ) => {
    setCriteriaScores((current) =>
      current.map((criterion) => {
        if (
          String(criterion.criterionId) !==
          String(criterionId)
        ) {
          return criterion;
        }

        let score = value;

        if (score !== "") {
          score = Number(score);

          if (score < 0) {
            score = 0;
          }

          if (
            score >
            Number(criterion.maxScore)
          ) {
            score = Number(
              criterion.maxScore
            );
          }
        }

        const numericScore =
          score === ""
            ? 0
            : Number(score);

        const weightedScore =
          criterion.maxScore > 0
            ? (numericScore /
                Number(
                  criterion.maxScore
                )) *
              Number(criterion.weight)
            : 0;

        return {
          ...criterion,
          score,
          weightedScore,
        };
      })
    );
  };

  /*
    Update criterion comment.
  */
  const handleCriterionCommentChange = (
    criterionId,
    value
  ) => {
    setCriteriaScores((current) =>
      current.map((criterion) =>
        String(criterion.criterionId) ===
        String(criterionId)
          ? {
              ...criterion,
              comment: value,
            }
          : criterion
      )
    );
  };

  /*
    Submit score.
  */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
      Validate every criterion.
    */
    const incomplete =
      criteriaScores.some(
        (criterion) =>
          criterion.score === "" ||
          criterion.score === null ||
          criterion.score === undefined
      );

    if (incomplete) {
      setError(
        "Please enter a score for every criterion."
      );
      return;
    }

    /*
      Validate score ranges.
    */
    const invalid =
      criteriaScores.some(
        (criterion) =>
          Number(criterion.score) < 0 ||
          Number(criterion.score) >
            Number(criterion.maxScore)
      );

    if (invalid) {
      setError(
        "One or more scores are outside the allowed range."
      );
      return;
    }

    if (!project?._id) {
      setError("Project information is missing.");
      return;
    }

    if (!rubric?._id) {
      setError("Rubric information is missing.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        event:
          project.event?._id ||
          project.event ||
          assignment?.event?._id ||
          assignment?.event,

        project: project._id,

        rubric: rubric._id,

        criteriaScores:
          criteriaScores.map(
            (criterion) => ({
              criterionId:
                criterion.criterionId,

              name: criterion.name,

              score: Number(
                criterion.score
              ),

              maxScore: Number(
                criterion.maxScore
              ),

              weight: Number(
                criterion.weight
              ),

              weightedScore:
                Number(
                  criterion.weightedScore
                ),

              comment:
                criterion.comment || "",
            })
          ),

        totalScore: Number(
          totalScore.toFixed(2)
        ),

        overallComment:
          overallComment.trim(),
      };

      const response =
        await scoreService.createScore(
          payload
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to submit score."
        );
      }

      setSuccess(
        "Score submitted successfully!"
      );

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit score."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <Loader />;
  }

  if (!rubric) {
    return (
      <ErrorMessage message="No rubric is assigned to this project." />
    );
  }

  return (
    <form
      className="score-form"
      onSubmit={handleSubmit}
    >
      <div className="score-form-header">
        <div>
          <h2>Evaluate Project</h2>

          <p>
            Score this project according to
            the assigned rubric.
          </p>
        </div>

        <div className="score-total-box">
          <span>Current Total</span>

          <strong>
            {totalScore.toFixed(2)}
            <small> / 100</small>
          </strong>
        </div>
      </div>

      {error && (
        <ErrorMessage message={error} />
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* RUBRIC INFO */}
      <div className="score-rubric-info">
        <h3>{rubric.name}</h3>

        {rubric.description && (
          <p>{rubric.description}</p>
        )}

        <div className="score-rubric-meta">
          <span>
            Criteria:{" "}
            {rubric.criteria?.length || 0}
          </span>

          <span>
            Total Weight:{" "}
            {rubric.criteria?.reduce(
              (sum, item) =>
                sum +
                Number(item.weight || 0),
              0
            )}
            %
          </span>
        </div>
      </div>

      {/* CRITERIA */}
      <div className="score-criteria">
        <h3>Evaluation Criteria</h3>

        {criteriaScores.map(
          (criterion, index) => (
            <div
              className="score-criterion-card"
              key={criterion.criterionId}
            >
              <div className="score-criterion-header">
                <div>
                  <span className="criterion-number">
                    {index + 1}
                  </span>

                  <h4>
                    {criterion.name}
                  </h4>
                </div>

                <span className="criterion-weight">
                  Weight:{" "}
                  {criterion.weight}%
                </span>
              </div>

              <div className="score-input-row">
                <div className="score-input-group">
                  <label>
                    Score
                  </label>

                  <div className="score-input-wrapper">
                    <input
                      type="number"
                      min="0"
                      max={criterion.maxScore}
                      step="0.01"
                      value={
                        criterion.score
                      }
                      onChange={(e) =>
                        handleScoreChange(
                          criterion.criterionId,
                          e.target.value
                        )
                      }
                      required
                    />

                    <span>
                      /{" "}
                      {criterion.maxScore}
                    </span>
                  </div>
                </div>

                <div className="weighted-score-box">
                  <span>
                    Weighted Score
                  </span>

                  <strong>
                    {Number(
                      criterion.weightedScore ||
                        0
                    ).toFixed(2)}
                  </strong>
                </div>
              </div>

              <div className="criterion-comment">
                <label>
                  Criterion Comment
                </label>

                <textarea
                  value={
                    criterion.comment || ""
                  }
                  onChange={(e) =>
                    handleCriterionCommentChange(
                      criterion.criterionId,
                      e.target.value
                    )
                  }
                  placeholder="Optional comment..."
                  rows="3"
                />
              </div>
            </div>
          )
        )}
      </div>

      {/* OVERALL COMMENT */}
      <div className="overall-comment">
        <label>
          Overall Evaluation Comment
        </label>

        <textarea
          value={overallComment}
          onChange={(e) =>
            setOverallComment(
              e.target.value
            )
          }
          placeholder="Write your overall feedback about this project..."
          rows="5"
        />
      </div>

      {/* ACTIONS */}
      <div className="score-form-actions">
        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Score"}
        </button>
      </div>
    </form>
  );
}

export default ScoreForm;