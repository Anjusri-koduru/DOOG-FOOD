import api from "./api";

const scoreService = {
  // Judge - get all my scores
  getMyScores: async () => {
    const response = await api.get("/scores/my");
    return response.data;
  },

  // Judge - get my score for a particular project
  getMyProjectScores: async (projectId) => {
    const response = await api.get(
      `/scores/my/project/${projectId}`
    );

    return response.data;
  },

  // Get all scores for a project
  getProjectScores: async (projectId) => {
    const response = await api.get(
      `/scores/project/${projectId}`
    );

    return response.data;
  },

  // Organizer/Admin - get event scores
  getEventScores: async (eventId) => {
    const response = await api.get(
      `/scores/event/${eventId}`
    );

    return response.data;
  },

  // Get single score
  getScoreById: async (scoreId) => {
    const response = await api.get(
      `/scores/${scoreId}`
    );

    return response.data;
  },

  // Create / submit score
  createScore: async (scoreData) => {
    const response = await api.post(
      "/scores",
      scoreData
    );

    return response.data;
  },
};

export default scoreService;