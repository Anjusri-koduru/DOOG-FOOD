import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import voteService from "../../services/voteService";

function MyVotes() {
  const [votes, setVotes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
    Backend currently provides
    event voting results.

    We use those results and mark
    projects based on the current
    voting information available.
  */

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loader-container page-loader">
        <div className="loader"></div>
        <p>
          Loading your votes...
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            PARTICIPANT
          </p>

          <h1>
            My Votes
          </h1>

          <p>
            View and manage the projects
            you have voted for.
          </p>
        </div>

      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {votes.length === 0 && (
        <div className="empty-state">

          <div className="empty-state-icon">
            🗳️
          </div>

          <h2>
            No votes to display
          </h2>

          <p>
            Open a submitted project and
            use the Vote button to support it.
          </p>

          <Link
            to="/events"
            className="primary-button"
          >
            Explore Events
          </Link>

        </div>
      )}

    </div>
  );
}

export default MyVotes;