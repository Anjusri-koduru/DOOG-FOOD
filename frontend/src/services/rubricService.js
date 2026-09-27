import api from "./api";

const rubricService = {
  // Get all rubrics for an event
  getEventRubrics: async (eventId) => {
    const response = await api.get(
      `/rubrics/event/${eventId}`
    );

    return response.data;
  },

  // Get rubric by track
  getTrackRubrics: async (trackId) => {
    const response = await api.get(
      `/rubrics/track/${trackId}`
    );

    return response.data;
  },

  // Get one rubric
  getRubricById: async (rubricId) => {
    const response = await api.get(
      `/rubrics/${rubricId}`
    );

    return response.data;
  },

  // Create rubric
  createRubric: async (rubricData) => {
    const response = await api.post(
      "/rubrics",
      rubricData
    );

    return response.data;
  },

  // Update rubric
  updateRubric: async (rubricId, rubricData) => {
    const response = await api.put(
      `/rubrics/${rubricId}`,
      rubricData
    );

    return response.data;
  },

  // Delete rubric
  deleteRubric: async (rubricId) => {
    const response = await api.delete(
      `/rubrics/${rubricId}`
    );

    return response.data;
  },
};

export default rubricService;