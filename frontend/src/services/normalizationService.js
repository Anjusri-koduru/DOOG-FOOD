import api from "./api";

const normalizationService = {
  // Normalize all scores for an event
  normalizeEvent: async (eventId) => {
    const response = await api.post(
      `/normalization/event/${eventId}/normalize`
    );

    return response.data;
  },

  // Get normalized scores for an event
  getEventNormalization: async (eventId) => {
    const response = await api.get(
      `/normalization/event/${eventId}`
    );

    return response.data;
  },

  // Get normalized scores for one project
  getProjectNormalization: async (projectId) => {
    const response = await api.get(
      `/normalization/project/${projectId}`
    );

    return response.data;
  },
};

export default normalizationService;