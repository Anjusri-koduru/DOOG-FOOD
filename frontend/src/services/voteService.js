import api from "./api";

const voteService = {
  // Cast vote for a project
  createVote: async (projectId) => {
    const response = await api.post("/votes", {
      project: projectId,
    });

    return response.data;
  },

  // Remove vote
  removeVote: async (projectId) => {
    const response = await api.delete(
      `/votes/project/${projectId}`
    );

    return response.data;
  },

  // Check whether current user voted
  checkMyVote: async (projectId) => {
    const response = await api.get(
      `/votes/project/${projectId}/me`
    );

    return response.data;
  },

  // Get total votes for a project
  getProjectVoteCount: async (projectId) => {
    const response = await api.get(
      `/votes/project/${projectId}/count`
    );

    return response.data;
  },

  // Get voting results for an event
  getEventVotingResults: async (eventId) => {
    const response = await api.get(
      `/votes/event/${eventId}`
    );

    return response.data;
  },
};

export default voteService;