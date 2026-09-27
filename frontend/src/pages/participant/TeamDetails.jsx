import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import teamService from "../../services/teamService";

import TeamMembers from "../../components/teams/TeamMembers";

function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [team, setTeam] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [teamName, setTeamName] =
    useState("");

  const [inviteUserId, setInviteUserId] =
    useState("");

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await teamService.getTeamById(
          teamId
        );

      const teamData =
        response?.data?.team ||
        response?.data ||
        response?.team ||
        null;

      setTeam(teamData);

      setTeamName(
        teamData?.name || ""
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load team."
      );
    } finally {
      setLoading(false);
    }
  };

  const leaderId =
    team?.leader?._id ||
    team?.leader;

  const isLeader =
    String(leaderId) ===
    String(user?._id || user?.id);

  const handleUpdateName =
    async (event) => {
      event.preventDefault();

      if (!teamName.trim()) {
        setError(
          "Team name cannot be empty."
        );
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await teamService.updateTeam(
          teamId,
          {
            name: teamName.trim(),
          }
        );

        setSuccess(
          "Team name updated successfully."
        );

        await loadTeam();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to update team."
        );
      } finally {
        setSaving(false);
      }
    };

  const handleInvite = async (
    event
  ) => {
    event.preventDefault();

    if (!inviteUserId.trim()) {
      setError(
        "Please enter a user ID."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await teamService.inviteMember(
        teamId,
        inviteUserId.trim()
      );

      setInviteUserId("");

      setSuccess(
        "Invitation sent successfully."
      );

      await loadTeam();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to send invitation."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember =
    async (userId, name) => {
      const confirmed =
        window.confirm(
          `Remove ${
            name || "this member"
          } from the team?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await teamService.removeMember(
          teamId,
          userId
        );

        setSuccess(
          "Member removed successfully."
        );

        await loadTeam();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to remove member."
        );
      } finally {
        setSaving(false);
      }
    };

  const handleLeave = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to leave this team?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await teamService.leaveTeam(
        teamId
      );

      navigate("/my-teams");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to leave team."
      );

      setSaving(false);
    }
  };

  const handleDisband = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to disband this team?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await teamService.disbandTeam(
        teamId
      );

      setSuccess(
        "Team disbanded successfully."
      );

      await loadTeam();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to disband team."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container page-loader">
        <div className="loader"></div>
        <p>Loading team...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            👥
          </div>

          <h2>Team not found</h2>

          <p>
            This team may have been deleted
            or you may not have access.
          </p>

          <Link
            to="/my-teams"
            className="primary-button"
          >
            Back to My Teams
          </Link>
        </div>
      </div>
    );
  }

  const eventName =
    team.event?.title ||
    team.event?.name ||
    "Hackathon Event";

  return (
    <div className="page-container">
      <Link
        to="/my-teams"
        className="back-link"
      >
        ← Back to My Teams
      </Link>

      <div className="team-detail-header">
        <div>
          <p className="page-eyebrow">
            TEAM
          </p>

          <h1>{team.name}</h1>

          <p>
            🎯 {eventName}
          </p>
        </div>

        <span
          className={
            team.status === "disbanded"
              ? "status-badge status-inactive"
              : "status-badge status-active"
          }
        >
          {team.status === "disbanded"
            ? "Disbanded"
            : "Active"}
        </span>
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

      <div className="team-detail-grid">
        <div>
          <TeamMembers
            team={team}
            currentUserId={
              user?._id || user?.id
            }
            onRemove={
              isLeader
                ? handleRemoveMember
                : null
            }
          />
        </div>

        <div className="team-sidebar">
          {isLeader && (
            <>
              <div className="module-form-card">
                <div className="card-header">
                  <h2>
                    Team Settings
                  </h2>

                  <p>
                    Manage your team.
                  </p>
                </div>

                <form
                  className="module-form"
                  onSubmit={
                    handleUpdateName
                  }
                >
                  <div className="form-group">
                    <label htmlFor="team-name-edit">
                      Team Name
                    </label>

                    <input
                      id="team-name-edit"
                      value={teamName}
                      onChange={(event) =>
                        setTeamName(
                          event.target
                            .value
                        )
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    Update Name
                  </button>
                </form>
              </div>

              <div className="module-form-card">
                <div className="card-header">
                  <h2>
                    Invite Member
                  </h2>

                  <p>
                    Invite another participant
                    using their User ID.
                  </p>
                </div>

                <form
                  className="module-form"
                  onSubmit={handleInvite}
                >
                  <div className="form-group">
                    <label htmlFor="invite-user">
                      User ID
                    </label>

                    <input
                      id="invite-user"
                      value={
                        inviteUserId
                      }
                      onChange={(event) =>
                        setInviteUserId(
                          event.target
                            .value
                        )
                      }
                      placeholder="Enter user ID"
                    />
                  </div>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    Send Invitation
                  </button>
                </form>
              </div>

              <div className="danger-zone">
                <h3>
                  Danger Zone
                </h3>

                <p>
                  Disbanding a team is a
                  permanent team action.
                </p>

                <button
                  type="button"
                  className="danger-button"
                  disabled={saving}
                  onClick={
                    handleDisband
                  }
                >
                  Disband Team
                </button>
              </div>
            </>
          )}

          {!isLeader &&
            team.status !==
              "disbanded" && (
              <div className="module-form-card">
                <div className="card-header">
                  <h2>
                    Leave Team
                  </h2>

                  <p>
                    You can leave this team
                    if you no longer want to
                    participate.
                  </p>
                </div>

                <button
                  type="button"
                  className="danger-button"
                  disabled={saving}
                  onClick={handleLeave}
                >
                  Leave Team
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default TeamDetails;