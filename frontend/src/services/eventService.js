import api from "./api";

const eventService = {
  // Public published events
  getPublicEvents: async (params = {}) => {
    const response = await api.get("/events/public", { params });
    return response.data;
  },

  // Public event by slug
  getEventBySlug: async (slug) => {
    const response = await api.get(`/events/slug/${slug}`);
    return response.data;
  },

  // Event by ID
  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Organizer/Admin - all events
  getAllEvents: async (params = {}) => {
    const response = await api.get("/events", { params });
    return response.data;
  },

  // Organizer/Admin - create
  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  // Organizer/Admin - update
  updateEvent: async (eventId, eventData) => {
    const response = await api.put(
      `/events/${eventId}`,
      eventData
    );
    return response.data;
  },

  // Organizer/Admin - delete
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  // Publish
  publishEvent: async (eventId) => {
    const response = await api.patch(
      `/events/${eventId}/publish`
    );
    return response.data;
  },

  // Unpublish
  unpublishEvent: async (eventId) => {
    const response = await api.patch(
      `/events/${eventId}/unpublish`
    );
    return response.data;
  },
};

export default eventService;