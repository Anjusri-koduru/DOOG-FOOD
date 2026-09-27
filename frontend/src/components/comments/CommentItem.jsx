import { useState } from "react";

import useAuth from "../../hooks/useAuth";

import CommentBox from "./CommentBox";

function CommentItem({
  comment,
  onReply,
  onUpdate,
  onDelete,
  level = 0,
}) {
  const {
    user,
  } = useAuth();

  const [replying, setReplying] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!comment) {
    return null;
  }

  const author =
    comment.author ||
    comment.user ||
    {};

  const authorId =
    author?._id ||
    author?.id ||
    comment.authorId;

  const currentUserId =
    user?._id ||
    user?.id;

  const isOwner =
    Boolean(
      authorId &&
      currentUserId &&
      String(authorId) ===
        String(currentUserId)
    );

  const authorName =
    author?.name ||
    comment.authorName ||
    "User";

  const authorInitial =
    authorName
      .charAt(0)
      .toUpperCase();

  const content =
    comment.isDeleted
      ? "This comment has been deleted."
      : comment.content || "";

  const createdAt =
    comment.createdAt ||
    comment.updatedAt;

  const formattedDate =
    createdAt
      ? new Date(
          createdAt
        ).toLocaleString()
      : "";

  const handleReply = async (
    replyContent
  ) => {
    try {
      setActionLoading(true);
      setError("");

      const success =
        await onReply(
          comment._id,
          replyContent
        );

      if (success !== false) {
        setReplying(false);
      }

      return success;
    } catch (err) {
      setError(
        err?.message ||
          "Failed to reply."
      );

      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (
    updatedContent
  ) => {
    try {
      setActionLoading(true);
      setError("");

      const success =
        await onUpdate(
          comment._id,
          updatedContent
        );

      if (success !== false) {
        setEditing(false);
      }

      return success;
    } catch (err) {
      setError(
        err?.message ||
          "Failed to update comment."
      );

      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this comment?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await onDelete(
        comment._id
      );
    } catch (err) {
      setError(
        err?.message ||
          "Failed to delete comment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      className="comment-item"
      style={{
        marginLeft:
          level > 0
            ? `${Math.min(
                level * 28,
                84
              )}px`
            : "0px",
      }}
    >
      <div className="comment-avatar">
        {author?.avatar ? (
          <img
            src={author.avatar}
            alt={authorName}
          />
        ) : (
          <span>
            {authorInitial}
          </span>
        )}
      </div>

      <div className="comment-content-wrapper">

        <div className="comment-header">
          <strong>
            {authorName}
          </strong>

          {author?.role && (
            <span className="comment-role">
              {author.role}
            </span>
          )}

          {formattedDate && (
            <span className="comment-date">
              {formattedDate}
            </span>
          )}
        </div>

        {editing ? (
          <CommentBox
            initialValue={
              comment.content || ""
            }
            onSubmit={
              handleUpdate
            }
            onCancel={() =>
              setEditing(false)
            }
            loading={
              actionLoading
            }
            buttonText="Save"
            compact
          />
        ) : (
          <p
            className={
              comment.isDeleted
                ? "comment-deleted"
                : "comment-text"
            }
          >
            {content}
          </p>
        )}

        {error && (
          <div className="comment-error">
            {error}
          </div>
        )}

        {!comment.isDeleted &&
          !editing && (
            <div className="comment-actions">

              <button
                type="button"
                onClick={() =>
                  setReplying(
                    (value) => !value
                  )
                }
                disabled={
                  actionLoading
                }
              >
                Reply
              </button>

              {isOwner && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setEditing(true)
                    }
                    disabled={
                      actionLoading
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleDelete
                    }
                    disabled={
                      actionLoading
                    }
                    className="comment-delete-action"
                  >
                    Delete
                  </button>
                </>
              )}

            </div>
          )}

        {replying &&
          !comment.isDeleted && (
            <div className="comment-reply-box">

              <CommentBox
                onSubmit={
                  handleReply
                }
                onCancel={() =>
                  setReplying(false)
                }
                loading={
                  actionLoading
                }
                placeholder="Write a reply..."
                buttonText="Reply"
                compact
              />

            </div>
          )}

      </div>
    </div>
  );
}

export default CommentItem;