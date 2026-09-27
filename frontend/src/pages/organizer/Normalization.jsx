import { useState } from "react";

import normalizationService from "../../services/normalizationService";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

function Normalization() {
  const [eventId, setEventId] = useState("");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [normalizing, setNormalizing] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [hasLoaded, setHasLoaded] =
    useState(false);

  /*
    Extract normalized result array
    from different possible backend
    response structures.
  */
  const extractResults = (response) => {
    const data =
      response?.data ||
      response;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    if (Array.isArray(data?.normalizedScores)) {
      return data.normalizedScores;
    }

    if (Array.isArray(data?.scores)) {
      return data.scores;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    return [];
  };

  /*
    Load existing normalization results.
  */
  const handleLoadResults = async (event) => {
    event.preventDefault();

    if (!eventId.trim()) {
      setError("Please enter an Event ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await normalizationService
          .getEventNormalization(
            eventId.trim()
          );

      const data =
        extractResults(response);

      setResults(data);
      setHasLoaded(true);
    } catch (err) {
      console.error(
        "Load normalization error:",
        err
      );

      setResults([]);
      setHasLoaded(true);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load normalization results."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    Run normalization.
  */
  const handleNormalize = async () => {
    if (!eventId.trim()) {
      setError("Please enter an Event ID.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to normalize the scores for this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setNormalizing(true);
      setError("");
      setSuccess("");

      const response =
        await normalizationService
          .normalizeEvent(
            eventId.trim()
          );

      const data =
        extractResults(response);

      setResults(data);
      setHasLoaded(true);

      setSuccess(
        "Scores normalized successfully."
      );
    } catch (err) {
      console.error(
        "Normalization error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to normalize scores."
      );
    } finally {
      setNormalizing(false);
    }
  };

  /*
    Get project information.
  */
  const getProject = (item) => {
    return (
      item?.project ||
      item?.projectId ||
      {}
    );
  };

  /*
    Get project title.
  */
  const getProjectTitle = (item) => {
    const project =
      getProject(item);

    if (
      typeof project === "string"
    ) {
      return project;
    }

    return (
      project?.title ||
      item?.projectTitle ||
      "Unknown Project"
    );
  };

  /*
    Get team information.
  */
  const getTeamName = (item) => {
    const project =
      getProject(item);

    const team =
      project?.team ||
      item?.team ||
      {};

    if (
      typeof team === "string"
    ) {
      return team;
    }

    return (
      team?.name ||
      item?.teamName ||
      "—"
    );
  };

  /*
    Get original score.
  */
  const getOriginalScore = (item) => {
    const value =
      item?.originalScore ??
      item?.rawScore ??
      item?.totalScore ??
      item?.score;

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  /*
    Get normalized score.
  */
  const getNormalizedScore = (item) => {
    const value =
      item?.normalizedScore ??
      item?.normalized ??
      item?.finalScore;

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  /*
    Get ranking.
  */
  const getRank = (
    item,
    index
  ) => {
    return (
      item?.rank ||
      item?.ranking ||
      index + 1
    );
  };

  /*
    Sort by normalized score.
  */
  const sortedResults = [
    ...results,
  ].sort((a, b) => {
    return (
      getNormalizedScore(b) -
      getNormalizedScore(a)
    );
  });

  return (
    <div className="page-container">

      {/* PAGE HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Score Normalization
          </h1>

          <p>
            Normalize judge scores and
            view the final comparable
            scores for an event.
          </p>
        </div>

      </div>

      {/* EVENT SEARCH */}
      <form
        className="normalization-event-search"
        onSubmit={
          handleLoadResults
        }
      >
        <div className="normalization-input-group">

          <label>
            Event ID
          </label>

          <input
            type="text"
            value={eventId}
            onChange={(e) =>
              setEventId(
                e.target.value
              )
            }
            placeholder="Enter Event ID"
          />

        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={
            loading ||
            normalizing
          }
        >
          {loading
            ? "Loading..."
            : "Load Results"}
        </button>

        <button
          type="button"
          className="secondary-button"
          disabled={
            loading ||
            normalizing
          }
          onClick={
            handleNormalize
          }
        >
          {normalizing
            ? "Normalizing..."
            : "Normalize Scores"}
        </button>

      </form>

      {/* ERROR */}
      {error && (
        <ErrorMessage
          message={error}
        />
      )}

      {/* SUCCESS */}
      {success && (
        <div className="success-message normalization-success">
          {success}
        </div>
      )}

      {/* LOADING */}
      {loading && <Loader />}

      {/* INFO */}
      {!loading &&
        !error &&
        !hasLoaded && (
          <div className="normalization-info-card">

            <h3>
              How normalization works
            </h3>

            <p>
              Judge scores are converted
              into normalized scores so
              projects can be compared
              consistently.
            </p>

            <div className="normalization-steps">

              <div>
                <strong>1</strong>
                <span>
                  Collect judge scores
                </span>
              </div>

              <div>
                <strong>2</strong>
                <span>
                  Calculate score statistics
                </span>
              </div>

              <div>
                <strong>3</strong>
                <span>
                  Calculate normalized scores
                </span>
              </div>

              <div>
                <strong>4</strong>
                <span>
                  Generate project ranking
                </span>
              </div>

            </div>

          </div>
        )}

      {/* EMPTY */}
      {!loading &&
        hasLoaded &&
        results.length === 0 &&
        !error && (
          <EmptyState
            title="No normalization results"
            message="No normalized scores are available for this event yet. Submit judge scores first and then run normalization."
          />
        )}

      {/* RESULTS */}
      {!loading &&
        sortedResults.length > 0 && (
          <div className="normalization-results">

            <div className="normalization-results-header">

              <div>
                <h2>
                  Normalized Results
                </h2>

                <p>
                  {sortedResults.length}{" "}
                  project
                  {sortedResults.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <div className="normalization-event-id">
                Event:{" "}
                <strong>
                  {eventId}
                </strong>
              </div>

            </div>

            {/* TABLE */}
            <div className="normalization-table-wrapper">

              <table className="normalization-table">

                <thead>
                  <tr>
                    <th>
                      Rank
                    </th>

                    <th>
                      Project
                    </th>

                    <th>
                      Team
                    </th>

                    <th>
                      Original Score
                    </th>

                    <th>
                      Normalized Score
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {sortedResults.map(
                    (item, index) => {
                      const normalized =
                        getNormalizedScore(
                          item
                        );

                      return (
                        <tr
                          key={
                            item?._id ||
                            item?.project?._id ||
                            index
                          }
                        >

                          <td>
                            <span
                              className={`rank-badge rank-${index + 1}`}
                            >
                              {getRank(
                                item,
                                index
                              )}
                            </span>
                          </td>

                          <td>
                            <strong>
                              {getProjectTitle(
                                item
                              )}
                            </strong>
                          </td>

                          <td>
                            {getTeamName(
                              item
                            )}
                          </td>

                          <td>
                            {getOriginalScore(
                              item
                            ).toFixed(2)}
                          </td>

                          <td>
                            <strong className="normalized-score">
                              {normalized.toFixed(
                                2
                              )}
                            </strong>
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            {/* SCORE LEGEND */}
            <div className="normalization-note">

              <strong>
                Note:
              </strong>

              <span>
                Normalized scores are
                calculated from the
                submitted judge evaluations.
                Rankings shown here are
                based on the normalized
                result values returned by
                the backend.
              </span>

            </div>

          </div>
        )}

    </div>
  );
}

export default Normalization;