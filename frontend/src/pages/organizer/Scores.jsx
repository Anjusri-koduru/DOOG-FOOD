import { useState } from "react";

import scoreService from "../../services/scoreService";

import ScoreCard from "../../components/judging/ScoreCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

function Scores() {
  const [eventId, setEventId] =
    useState("");

  const [scores, setScores] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLoadScores = async (
    event
  ) => {
    event.preventDefault();

    if (!eventId.trim()) {
      setError(
        "Please enter an Event ID."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await scoreService.getEventScores(
          eventId.trim()
        );

      const scoreData =
        response?.data?.scores ||
        response?.scores ||
        response?.data ||
        [];

      setScores(
        Array.isArray(scoreData)
          ? scoreData
          : []
      );
    } catch (err) {
      console.error(
        "Event scores error:",
        err
      );

      setScores([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load event scores."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <h1>
            Scores
          </h1>

          <p>
            View judge evaluations
            for an event.
          </p>
        </div>

      </div>

      {/* EVENT SEARCH */}
      <form
        className="score-event-search"
        onSubmit={handleLoadScores}
      >

        <div>
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
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "Load Scores"}
        </button>

      </form>

      {error && (
        <ErrorMessage
          message={error}
        />
      )}

      {loading && <Loader />}

      {!loading &&
        !error &&
        scores.length === 0 &&
        eventId && (
          <EmptyState
            title="No scores found"
            message="No judge scores are available for this event."
          />
        )}

      {!loading &&
        scores.length > 0 && (
          <div className="scores-list">

            <div className="scores-summary">
              <strong>
                {scores.length}
              </strong>

              <span>
                score
                {scores.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </span>
            </div>

            {scores.map((score) => (
              <ScoreCard
                key={score._id}
                score={score}
              />
            ))}

          </div>
        )}

    </div>
  );
}

export default Scores;