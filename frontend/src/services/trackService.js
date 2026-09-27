import api from "./api";

const trackService = {
  // Create track
  createTrack: async (trackData) => {
    const response = await api.post(
      "/tracks",
      trackData
    );

    return response.data;
  },

  // Get active/public tracks of an event
  getEventTracks: async (eventId) => {
    const response = await api.get(
      `/tracks/event/${eventId}`
    );

    return response.data;
  },

  // Get all tracks for organizer/admin
  getAllEventTracks: async (eventId) => {
    const response = await api.get(
      `/tracks/event/${eventId}/all`
    );

    return response.data;
  },

  // Get one track
  getTrackById: async (trackId) => {
    const response = await api.get(
      `/tracks/${trackId}`
    );

    return response.data;
  },

  // Update track
  updateTrack: async (trackId, trackData) => {
    const response = await api.put(
      `/tracks/${trackId}`,
      trackData
    );

    return response.data;
  },

  // Delete track
  deleteTrack: async (trackId) => {
    const response = await api.delete(
      `/tracks/${trackId}`
    );

    return response.data;
  },
};

export default trackService;