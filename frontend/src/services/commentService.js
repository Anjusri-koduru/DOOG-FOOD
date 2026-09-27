import api from "./api";

const commentService = {
  // Get all comments for a project
  getProjectComments: async (projectId) => {
    const response = await api.get(
      `/comments/project/${projectId}`
    );

    return response.data;
  },

  // Get one comment
  getCommentById: async (commentId) => {
    const response = await api.get(
      `/comments/${commentId}`
    );

    return response.data;
  },

  // Create a comment or reply
  createComment: async (commentData) => {
    const response = await api.post(
      "/comments",
      commentData
    );

    return response.data;
  },

  // Edit own comment
  updateComment: async (
    commentId,
    commentData
  ) => {
    const response = await api.put(
      `/comments/${commentId}`,
      commentData
    );

    return response.data;
  },

  // Delete own comment
  deleteComment: async (commentId) => {
    const response = await api.delete(
      `/comments/${commentId}`
    );

    return response.data;
  },
};

export default commentService;