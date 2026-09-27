import { useEffect, useState } from "react";

import scoreService from "../../services/scoreService";

import ScoreCard from "../../components/judging/ScoreCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

function MyScores() {
  const [scores, setScores] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await scoreService.getMyScores();

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
        "My scores error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load your scores."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <h1>
            My Scores
          </h1>

          <p>
            View the evaluations you
            have submitted.
          </p>
        </div>

      </div>

      {error && (
        <ErrorMessage
          message={error}
        />
      )}

      {!error &&
        scores.length === 0 && (
          <EmptyState
            title="No scores yet"
            message="You have not submitted any project evaluations yet."
          />
        )}

      {scores.length > 0 && (
        <div className="scores-list">

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

export default MyScores;