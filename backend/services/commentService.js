const Comment = require("../models/Comment");
const Project = require("../models/Project");
const Event = require("../models/Event");

const getProject = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

const createComment = async ({
  user,
  projectId,
  content,
  parentCommentId = null,
}) => {
  const project = await getProject(projectId);

  if (project.status !== "submitted") {
    throw new Error(
      "Comments are available only for submitted projects"
    );
  }

  let parentComment = null;

  if (parentCommentId) {
    parentComment = await Comment.findById(
      parentCommentId
    );

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    if (parentComment.isDeleted) {
      throw new Error(
        "Cannot reply to a deleted comment"
      );
    }

    if (
      parentComment.project.toString() !==
      projectId.toString()
    ) {
      throw new Error(
        "Parent comment belongs to another project"
      );
    }
  }

  const comment = await Comment.create({
    event: project.event,
    project: project._id,
    author: user._id,
    parentComment:
      parentCommentId || null,
    content: content.trim(),
  });

  return Comment.findById(comment._id)
    .populate("author", "name email avatar")
    .populate(
      "parentComment",
      "author content createdAt"
    );
};

const getProjectComments = async (
  projectId,
  options = {}
) => {
  await getProject(projectId);

  const page = Math.max(
    Number(options.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(Number(options.limit) || 20, 1),
    100
  );

  const skip = (page - 1) * limit;

  const filter = {
    project: projectId,
    isDeleted: false,
  };

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .populate("author", "name email avatar")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit),

    Comment.countDocuments(filter),
  ]);

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getCommentById = async (commentId) => {
  const comment = await Comment.findById(commentId)
    .populate("author", "name email avatar")
    .populate(
      "parentComment",
      "author content createdAt"
    );

  if (!comment) {
    throw new Error("Comment not found");
  }

  return comment;
};

const updateComment = async (
  commentId,
  user,
  content
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.isDeleted) {
    throw new Error(
      "Deleted comments cannot be edited"
    );
  }

  if (
    comment.author.toString() !==
    user._id.toString()
  ) {
    throw new Error(
      "You can edit only your own comment"
    );
  }

  const cleanContent = content.trim();

  if (!cleanContent) {
    throw new Error("Comment content is required");
  }

  if (cleanContent.length > 2000) {
    throw new Error(
      "Comment cannot exceed 2000 characters"
    );
  }

  comment.content = cleanContent;

  await comment.save();

  return Comment.findById(comment._id).populate(
    "author",
    "name email avatar"
  );
};

const deleteComment = async (
  commentId,
  user
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  const isOwner =
    comment.author.toString() ===
    user._id.toString();

  const isModerator =
    user.role === "organizer" ||
    user.role === "admin";

  if (!isOwner && !isModerator) {
    throw new Error(
      "You are not allowed to delete this comment"
    );
  }

  comment.isDeleted = true;
  comment.deletedAt = new Date();
  comment.content = "[deleted]";

  await comment.save();

  return comment;
};

module.exports = {
  createComment,
  getProjectComments,
  getCommentById,
  updateComment,
  deleteComment,
};