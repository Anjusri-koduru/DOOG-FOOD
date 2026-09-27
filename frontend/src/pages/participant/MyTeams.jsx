import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import teamService from "../../services/teamService";
import TeamCard from "../../components/teams/TeamCard";
import InviteCard from "../../components/teams/InviteCard";

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [invites, setInvites] = useState([]);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [formData, setFormData] =
    useState({
      event: "",
      name: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [inviteLoading, setInviteLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        teamsResponse,
        invitesResponse,
      ] = await Promise.all([
        teamService.getMyTeams(),
        teamService.getMyInvites(),
      ]);

      const teamList =
        teamsResponse?.data?.teams ||
        teamsResponse?.data ||
        teamsResponse?.teams ||
        [];

      const inviteList =
        invitesResponse?.data?.invites ||
        invitesResponse?.data ||
        invitesResponse?.invites ||
        [];

      setTeams(
        Array.isArray(teamList)
          ? teamList
          : []
      );

      setInvites(
        Array.isArray(inviteList)
          ? inviteList
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load teams."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleCreateTeam = async (
    event
  ) => {
    event.preventDefault();

    if (!formData.event.trim()) {
      setError(
        "Please enter the Event ID."
      );
      return;
    }

    if (!formData.name.trim()) {
      setError(
        "Please enter a team name."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await teamService.createTeam({
        event: formData.event.trim(),
        name: formData.name.trim(),
      });

      setFormData({
        event: "",
        name: "",
      });

      setShowCreateForm(false);

      setSuccess(
        "Team created successfully."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create team."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAccept = async (
    invite
  ) => {
    const inviteId =
      invite._id || invite.id;

    try {
      setInviteLoading(true);
      setError("");
      setSuccess("");

      await teamService.acceptInvite(
        inviteId
      );

      setSuccess(
        "Team invitation accepted."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to accept invitation."
      );
    } finally {
      setInviteLoading(false);
    }
  };

  const handleReject = async (
    invite
  ) => {
    const inviteId =
      invite._id || invite.id;

    try {
      setInviteLoading(true);
      setError("");
      setSuccess("");

      await teamService.rejectInvite(
        inviteId
      );

      setSuccess(
        "Team invitation rejected."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to reject invitation."
      );
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header team-page-header">
        <div>
          <p className="page-eyebrow">
            PARTICIPANT
          </p>

          <h1>My Teams</h1>

          <p>
            Create teams, manage members and
            respond to invitations.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setShowCreateForm(
              (previous) => !previous
            )
          }
        >
          {showCreateForm
            ? "Close"
            : "+ Create Team"}
        </button>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {success && (
        <div className="form-success">
          {success}
        </div>
      )}

      {showCreateForm && (
        <div className="module-form-card create-team-form">
          <div className="card-header">
            <h2>Create New Team</h2>

            <p>
              Create a team for a hackathon
              event.
            </p>
          </div>

          <form
            className="module-form"
            onSubmit={
              handleCreateTeam
            }
          >
            <div className="form-group">
              <label htmlFor="team-event">
                Event ID *
              </label>

              <input
                id="team-event"
                name="event"
                value={formData.event}
                onChange={handleChange}
                placeholder="Enter event ID"
                required
              />

              <small className="form-help">
                You can copy the Event ID from
                the event details page.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="team-name">
                Team Name *
              </label>

              <input
                id="team-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Team Innovators"
                required
              />
            </div>

            <div className="form-action-row">
              <button
                type="submit"
                className="auth-submit"
                disabled={saving}
              >
                {saving
                  ? "Creating..."
                  : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      )}

      {invites.length > 0 && (
        <section className="teams-section">
          <div className="section-heading">
            <div>
              <h2>
                Team Invitations
              </h2>

              <p>
                You have{" "}
                {invites.length} pending
                invitation
                {invites.length !== 1
                  ? "s"
                  : ""}
                .
              </p>
            </div>
          </div>

          <div className="invites-list">
            {invites.map((invite) => (
              <InviteCard
                key={invite._id}
                invite={invite}
                onAccept={
                  handleAccept
                }
                onReject={
                  handleReject
                }
                loading={
                  inviteLoading
                }
              />
            ))}
          </div>
        </section>
      )}

      <section className="teams-section">
        <div className="section-heading">
          <div>
            <h2>My Teams</h2>

            <p>
              {teams.length} team
              {teams.length !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>
              Loading your teams...
            </p>
          </div>
        ) : teams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              👥
            </div>

            <h3>
              You haven't joined a team
              yet
            </h3>

            <p>
              Create a team or accept an
              invitation to get started.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setShowCreateForm(
                  true
                )
              }
            >
              Create Your First Team
            </button>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map((team) => (
              <TeamCard
                key={team._id}
                team={team}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyTeams;