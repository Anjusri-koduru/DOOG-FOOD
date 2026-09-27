import api from "./api";

const projectService = {
  // Get logged-in user's projects
  getMyProjects: async () => {
    const response = await api.get(
      "/projects/my"
    );

    return response.data;
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    const response = await api.get(
      `/projects/${projectId}`
    );

    return response.data;
  },

  // Create project
  createProject: async (projectData) => {
    const response = await api.post(
      "/projects",
      projectData
    );

    return response.data;
  },

  // Update project
  updateProject: async (
    projectId,
    projectData
  ) => {
    const response = await api.put(
      `/projects/${projectId}`,
      projectData
    );

    return response.data;
  },

  // Submit project
  submitProject: async (projectId) => {
    const response = await api.patch(
      `/projects/${projectId}/submit`
    );

    return response.data;
  },

  // Withdraw project
  withdrawProject: async (projectId) => {
    const response = await api.patch(
      `/projects/${projectId}/withdraw`
    );

    return response.data;
  },

  // ⭐ Organizer/Admin - Get all projects
  getAllProjects: async () => {
    const response = await api.get(
      "/projects"
    );

    return response.data;
  },

  // Get projects belonging to one event
  getProjectsByEvent: async (eventId) => {
    const response = await api.get(
      `/projects/event/${eventId}`
    );

    return response.data;
  },
};

export default projectService;