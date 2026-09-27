function InviteCard({
  invite,
  onAccept,
  onReject,
  loading,
}) {
  if (!invite) {
    return null;
  }

  const team =
    invite.team || {};

  const event =
    team.event || invite.event || {};

  const teamName =
    team.name || "Team";

  const eventName =
    event.title ||
    event.name ||
    "Hackathon Event";

  const invitedBy =
    invite.invitedBy?.name ||
    invite.invitedBy?.email ||
    "Team Leader";

  return (
    <div className="invite-card">
      <div className="invite-icon">
        ✉️
      </div>

      <div className="invite-content">
        <h3>{teamName}</h3>

        <p>
          You have been invited to join this
          team.
        </p>

        <div className="invite-meta">
          <span>
            🎯 {eventName}
          </span>

          <span>
            👤 Invited by: {invitedBy}
          </span>
        </div>

        <div className="invite-actions">
          <button
            type="button"
            className="primary-button"
            disabled={loading}
            onClick={() =>
              onAccept(invite)
            }
          >
            {loading
              ? "Processing..."
              : "Accept"}
          </button>

          <button
            type="button"
            className="secondary-button"
            disabled={loading}
            onClick={() =>
              onReject(invite)
            }
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteCard;