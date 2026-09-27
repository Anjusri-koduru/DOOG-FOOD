import api from "./api";

const auditService = {
  // Get audit logs
  getLogs: async (params = {}) => {
    const response = await api.get("/audit", {
      params,
    });

    return response.data;
  },

  // Get single audit log
  getLogById: async (logId) => {
    const response = await api.get(`/audit/${logId}`);

    return response.data;
  },

  // Get event audit summary
  getEventSummary: async (eventId) => {
    const response = await api.get(`/audit/event/${eventId}/summary`);

    return response.data;
  },
};

export default auditService;