const asyncHandler = require("../utils/asyncHandler");

const {
  createComment,
  getProjectComments,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../services/commentService");

const createCommentController = asyncHandler(
  async (req, res) => {
    const { projectId, content, parentCommentId } =
      req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const comment = await createComment({
      user: req.user,
      projectId,
      content,
      parentCommentId,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  }
);

const getProjectCommentsController =
  asyncHandler(async (req, res) => {
    const result = await getProjectComments(
      req.params.projectId,
      {
        page: req.query.page,
        limit: req.query.limit,
      }
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  });

const getCommentController = asyncHandler(
  async (req, res) => {
    const comment = await getCommentById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: comment,
    });
  }
);

const updateCommentController = asyncHandler(
  async (req, res) => {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const comment = await updateComment(
      req.params.id,
      req.user,
      content
    );

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  }
);

const deleteCommentController = asyncHandler(
  async (req, res) => {
    await deleteComment(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }
);

module.exports = {
  createCommentController,
  getProjectCommentsController,
  getCommentController,
  updateCommentController,
  deleteCommentController,
};