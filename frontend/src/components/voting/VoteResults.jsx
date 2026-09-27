import { useEffect, useState } from "react";

import voteService from "../../services/voteService";

function VoteResults({
  eventId,
}) {
  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (eventId) {
      loadResults();
    }
  }, [eventId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await voteService.getEventVotingResults(
          eventId
        );

      const resultData =
        response?.data?.results ||
        response?.data ||
        response?.results ||
        [];

      setResults(
        Array.isArray(resultData)
          ? resultData
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load voting results."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>
          Loading voting results...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-error">
        {error}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          🗳️
        </div>

        <h3>
          No voting results yet
        </h3>

        <p>
          Voting results will appear
          here once votes are recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="vote-results">

      <div className="vote-results-header">
        <h2>
          Voting Results
        </h2>

        <span>
          {results.length} Projects
        </span>
      </div>

      <div className="vote-results-list">

        {results.map(
          (result, index) => {
            const project =
              result.project || {};

            const projectId =
              project._id ||
              result.projectId ||
              result._id;

            const projectTitle =
              project.title ||
              result.projectTitle ||
              "Untitled Project";

            const team =
              project.team || {};

            const teamName =
              team.name ||
              result.teamName ||
              "Unknown Team";

            const voteCount =
              result.voteCount ??
              result.votes ??
              result.count ??
              0;

            return (
              <div
                className="vote-result-card"
                key={
                  projectId ||
                  `${projectTitle}-${index}`
                }
              >

                <div className="vote-rank">
                  #{index + 1}
                </div>

                <div className="vote-project-info">

                  <h3>
                    {projectTitle}
                  </h3>

                  <p>
                    👥 {teamName}
                  </p>

                </div>

                <div className="vote-total">

                  <strong>
                    {voteCount}
                  </strong>

                  <span>
                    Votes
                  </span>

                </div>

              </div>
            );
          }
        )}

      </div>
    </div>
  );
}

export default VoteResults;