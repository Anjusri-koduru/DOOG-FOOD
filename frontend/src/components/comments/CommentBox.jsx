import { useState } from "react";

function CommentBox({
  onSubmit,
  loading = false,
  placeholder = "Write a comment...",
  buttonText = "Comment",
  initialValue = "",
  onCancel,
  compact = false,
}) {
  const [content, setContent] =
    useState(initialValue);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent =
      content.trim();

    if (!trimmedContent) {
      return;
    }

    const success =
      await onSubmit(trimmedContent);

    if (success !== false) {
      setContent("");
    }
  };

  return (
    <form
      className={`comment-box ${
        compact ? "comment-box-compact" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <textarea
        value={content}
        onChange={(event) =>
          setContent(event.target.value)
        }
        placeholder={placeholder}
        rows={compact ? 3 : 4}
        maxLength={5000}
        disabled={loading}
      />

      <div className="comment-box-footer">
        <span className="comment-character-count">
          {content.length}/5000
        </span>

        <div className="comment-box-actions">
          {onCancel && (
            <button
              type="button"
              className="comment-cancel-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="primary-button comment-submit-button"
            disabled={
              loading ||
              !content.trim()
            }
          >
            {loading
              ? "Saving..."
              : buttonText}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CommentBox;