import api from "./api";

const judgeService = {
  getMyAssignments: async () => {
    const response = await api.get(
      "/judges/my"
    );

    return response.data;
  },

  getAllJudges: async () => {
    const response = await api.get(
      "/judges"
    );

    return response.data;
  },

  getEventJudges: async (eventId) => {
    const response = await api.get(
      `/judges/event/${eventId}/judges`
    );

    return response.data;
  },

  getEventAssignments: async (eventId) => {
    const response = await api.get(
      `/judges/event/${eventId}`
    );

    return response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post(
      "/judges",
      assignmentData
    );

    return response.data;
  },

  getAssignmentById: async (assignmentId) => {
    const response = await api.get(
      `/judges/${assignmentId}`
    );

    return response.data;
  },

  updateAssignmentStatus: async (
    assignmentId,
    status
  ) => {
    const response = await api.patch(
      `/judges/${assignmentId}/status`,
      { status }
    );

    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(
      `/judges/${assignmentId}`
    );

    return response.data;
  },
};

export default judgeService;