import api from "./api";

const teamService = {
  // Get teams of logged-in participant
  getMyTeams: async () => {
    const response = await api.get("/teams/my");
    return response.data;
  },

  // Get one team
  getTeamById: async (teamId) => {
    const response = await api.get(
      `/teams/${teamId}`
    );

    return response.data;
  },

  // Create team
  createTeam: async (teamData) => {
    const response = await api.post(
      "/teams",
      teamData
    );

    return response.data;
  },

  // Update team
  updateTeam: async (teamId, teamData) => {
    const response = await api.put(
      `/teams/${teamId}`,
      teamData
    );

    return response.data;
  },

  // Invite member
  inviteMember: async (
    teamId,
    userId
  ) => {
    const response = await api.post(
      `/teams/${teamId}/invites`,
      {
        userId,
      }
    );

    return response.data;
  },

  // Remove member
  removeMember: async (
    teamId,
    userId
  ) => {
    const response = await api.delete(
      `/teams/${teamId}/members/${userId}`
    );

    return response.data;
  },

  // Leave team
  leaveTeam: async (teamId) => {
    const response = await api.post(
      `/teams/${teamId}/leave`
    );

    return response.data;
  },

  // Disband team
  disbandTeam: async (teamId) => {
    const response = await api.delete(
      `/teams/${teamId}`
    );

    return response.data;
  },

  // Accept invitation
  acceptInvite: async (inviteId) => {
    const response = await api.post(
      `/teams/invites/${inviteId}/accept`
    );

    return response.data;
  },

  // Reject invitation
  rejectInvite: async (inviteId) => {
    const response = await api.post(
      `/teams/invites/${inviteId}/reject`
    );

    return response.data;
  },

  // ⭐ Organizer/Admin - Get all teams
  getAllTeams: async () => {
    const response = await api.get(
      "/teams"
    );

    return response.data;
  },

  // Get teams for a particular event
  getTeamsByEvent: async (eventId) => {
    const response = await api.get(
      `/teams/event/${eventId}`
    );

    return response.data;
  },
};

export default teamService;