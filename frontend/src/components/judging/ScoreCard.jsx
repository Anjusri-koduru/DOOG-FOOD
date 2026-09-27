function ScoreCard({ score }) {
  if (!score) {
    return null;
  }

  const project =
    score.project || {};

  const judge =
    score.judge || {};

  const rubric =
    score.rubric || {};

  const criteria =
    score.criteriaScores || [];

  return (
    <div className="score-card">

      <div className="score-card-header">

        <div>
          <h3>
            {project.title ||
              "Project"}
          </h3>

          <p>
            Judge:{" "}
            {judge.name ||
              judge.email ||
              "Unknown"}
          </p>

          <p>
            Rubric:{" "}
            {rubric.name ||
              "Rubric"}
          </p>
        </div>

        <div className="score-card-total">
          <span>Total Score</span>

          <strong>
            {Number(
              score.totalScore || 0
            ).toFixed(2)}
            <small>/100</small>
          </strong>
        </div>

      </div>

      <div className="score-card-criteria">

        {criteria.map(
          (criterion, index) => (
            <div
              className="score-card-criterion"
              key={
                criterion.criterionId ||
                index
              }
            >
              <div>
                <strong>
                  {criterion.name}
                </strong>

                <span>
                  Weight:{" "}
                  {criterion.weight}%
                </span>
              </div>

              <div className="score-card-score">
                {criterion.score}
                {" / "}
                {criterion.maxScore}
              </div>
            </div>
          )
        )}

      </div>

      {score.overallComment && (
        <div className="score-card-comment">

          <strong>
            Overall Comment
          </strong>

          <p>
            {score.overallComment}
          </p>

        </div>
      )}

      <div className="score-card-footer">

        <span>
          Status:{" "}
          <strong>
            {score.status || "submitted"}
          </strong>
        </span>

        {score.submittedAt && (
          <span>
            Submitted:{" "}
            {new Date(
              score.submittedAt
            ).toLocaleString()}
          </span>
        )}

      </div>

    </div>
  );
}

export default ScoreCard;