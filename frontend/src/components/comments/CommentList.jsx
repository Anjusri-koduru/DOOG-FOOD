import CommentItem from "./CommentItem";

function CommentList({
  comments = [],
  onReply,
  onUpdate,
  onDelete,
}) {
  if (!comments.length) {
    return (
      <div className="comments-empty">
        <div className="comments-empty-icon">
          💬
        </div>

        <h3>
          No comments yet
        </h3>

        <p>
          Be the first person to
          start the discussion.
        </p>
      </div>
    );
  }

  /*
    Convert flat comments into
    parent + replies structure.
  */
  const commentMap = {};

  comments.forEach((comment) => {
    commentMap[
      comment._id
    ] = {
      ...comment,
      replies: [],
    };
  });

  const rootComments = [];

  comments.forEach((comment) => {
    const parentId =
      comment.parentComment;

    if (
      parentId &&
      commentMap[parentId]
    ) {
      commentMap[
        parentId
      ].replies.push(
        commentMap[comment._id]
      );
    } else {
      rootComments.push(
        commentMap[
          comment._id
        ]
      );
    }
  });

  const renderComment = (
    comment,
    level = 0
  ) => (
    <div
      key={comment._id}
      className="comment-thread"
    >
      <CommentItem
        comment={comment}
        onReply={onReply}
        onUpdate={onUpdate}
        onDelete={onDelete}
        level={level}
      />

      {comment.replies &&
        comment.replies.length >
          0 && (
          <div className="comment-replies">
            {comment.replies.map(
              (reply) =>
                renderComment(
                  reply,
                  level + 1
                )
            )}
          </div>
        )}
    </div>
  );

  return (
    <div className="comment-list">
      {rootComments.map(
        (comment) =>
          renderComment(
            comment
          )
      )}
    </div>
  );
}

export default CommentList;