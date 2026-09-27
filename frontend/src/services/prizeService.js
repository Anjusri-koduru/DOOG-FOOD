import api from "./api";

const prizeService = {
  // Create prize
  createPrize: async (prizeData) => {
    const response = await api.post(
      "/prizes",
      prizeData
    );

    return response.data;
  },

  // Get active/public prizes
  getEventPrizes: async (eventId) => {
    const response = await api.get(
      `/prizes/event/${eventId}`
    );

    return response.data;
  },

  // Get all prizes for organizer/admin
  getAllEventPrizes: async (eventId) => {
    const response = await api.get(
      `/prizes/event/${eventId}/all`
    );

    return response.data;
  },

  // Get one prize
  getPrizeById: async (prizeId) => {
    const response = await api.get(
      `/prizes/${prizeId}`
    );

    return response.data;
  },

  // Update prize
  updatePrize: async (prizeId, prizeData) => {
    const response = await api.put(
      `/prizes/${prizeId}`,
      prizeData
    );

    return response.data;
  },

  // Delete prize
  deletePrize: async (prizeId) => {
    const response = await api.delete(
      `/prizes/${prizeId}`
    );

    return response.data;
  },
};

export default prizeService;