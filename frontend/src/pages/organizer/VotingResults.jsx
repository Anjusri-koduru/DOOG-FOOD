import { useState } from "react";

import VoteResults from "../../components/voting/VoteResults";

function VotingResults() {
  const [eventId, setEventId] =
    useState("");

  const [selectedEventId, setSelectedEventId] =
    useState("");

  const handleLoad = (event) => {
    event.preventDefault();

    if (!eventId.trim()) {
      return;
    }

    setSelectedEventId(
      eventId.trim()
    );
  };

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            ORGANIZER
          </p>

          <h1>
            Voting Results
          </h1>

          <p>
            View community voting results
            for your hackathon event.
          </p>
        </div>

      </div>

      <div className="module-form-card">

        <div className="card-header">

          <h2>
            Select Event
          </h2>

          <p>
            Enter the Event ID to load
            voting results.
          </p>

        </div>

        <form
          className="module-form"
          onSubmit={handleLoad}
        >

          <div className="form-group">

            <label htmlFor="voting-event-id">
              Event ID
            </label>

            <input
              id="voting-event-id"
              value={eventId}
              onChange={(event) =>
                setEventId(
                  event.target.value
                )
              }
              placeholder="Enter Event ID"
            />

          </div>

          <button
            type="submit"
            className="primary-button"
          >
            Load Voting Results
          </button>

        </form>

      </div>

      {selectedEventId && (
        <div className="module-form-card">

          <VoteResults
            eventId={
              selectedEventId
            }
          />

        </div>
      )}

    </div>
  );
}

export default VotingResults;