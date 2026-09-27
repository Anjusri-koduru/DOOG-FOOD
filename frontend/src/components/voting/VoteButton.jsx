import { useEffect, useState } from "react";

import voteService from "../../services/voteService";

function VoteButton({
  projectId,
  disabled = false,
}) {
  const [hasVoted, setHasVoted] =
    useState(false);

  const [voteCount, setVoteCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (projectId) {
      loadVoteStatus();
    }
  }, [projectId]);

  const loadVoteStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const [voteResponse, countResponse] =
        await Promise.all([
          voteService.checkMyVote(projectId),
          voteService.getProjectVoteCount(
            projectId
          ),
        ]);

      const voted =
        voteResponse?.data?.hasVoted ??
        voteResponse?.hasVoted ??
        false;

      const count =
        countResponse?.data?.count ??
        countResponse?.data?.voteCount ??
        countResponse?.count ??
        countResponse?.voteCount ??
        0;

      setHasVoted(Boolean(voted));
      setVoteCount(Number(count) || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load voting status."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    try {
      setActionLoading(true);
      setError("");

      if (hasVoted) {
        await voteService.removeVote(
          projectId
        );

        setHasVoted(false);
        setVoteCount(
          (previous) =>
            Math.max(0, previous - 1)
        );
      } else {
        await voteService.createVote(
          projectId
        );

        setHasVoted(true);
        setVoteCount(
          (previous) => previous + 1
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to process vote."
      );

      await loadVoteStatus();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vote-button-loading">
        Loading votes...
      </div>
    );
  }

  return (
    <div className="vote-button-wrapper">

      <button
        type="button"
        className={
          hasVoted
            ? "vote-button voted"
            : "vote-button"
        }
        onClick={handleVote}
        disabled={
          disabled ||
          actionLoading
        }
      >
        <span className="vote-icon">
          {hasVoted ? "❤️" : "🤍"}
        </span>

        <span>
          {actionLoading
            ? "Processing..."
            : hasVoted
            ? "Voted"
            : "Vote"}
        </span>

        <span className="vote-count">
          {voteCount}
        </span>
      </button>

      {error && (
        <p className="vote-error">
          {error}
        </p>
      )}

    </div>
  );
}

export default VoteButton;