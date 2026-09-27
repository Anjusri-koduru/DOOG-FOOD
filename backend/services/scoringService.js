const Score = require("../models/Score");
const Rubric = require("../models/Rubric");
const Project = require("../models/Project");
const Event = require("../models/Event");
const JudgeAssignment = require("../models/JudgeAssignment");

const getProject = async (projectId) => {
  const project = await Project.findById(
    projectId
  );

  if (!project) {
    const error = new Error(
      "Project not found"
    );

    error.statusCode = 404;
    throw error;
  }

  return project;
};

const getRubric = async (rubricId) => {
  const rubric = await Rubric.findById(
    rubricId
  );

  if (!rubric) {
    const error = new Error(
      "Rubric not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (!rubric.isActive) {
    const error = new Error(
      "Rubric is inactive"
    );

    error.statusCode = 400;
    throw error;
  }

  return rubric;
};

const checkAssignment = async (
  projectId,
  judgeId
) => {
  const assignment =
    await JudgeAssignment.findOne({
      project: projectId,
      judge: judgeId,
      status: {
        $in: [
          "assigned",
          "in_progress",
          "completed",
        ],
      },
    });

  if (!assignment) {
    const error = new Error(
      "You are not assigned to judge this project"
    );

    error.statusCode = 403;
    throw error;
  }

  return assignment;
};

const validateScores = (
  rubric,
  submittedScores
) => {
  if (
    !Array.isArray(submittedScores)
  ) {
    const error = new Error(
      "criteriaScores must be an array"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    submittedScores.length !==
    rubric.criteria.length
  ) {
    const error = new Error(
      "Scores must be provided for every rubric criterion"
    );

    error.statusCode = 400;
    throw error;
  }

  const rubricIds =
    rubric.criteria.map((criterion) =>
      criterion._id.toString()
    );

  const receivedIds =
    submittedScores.map((item) =>
      item.criterionId.toString()
    );

  for (const id of rubricIds) {
    if (!receivedIds.includes(id)) {
      const error = new Error(
        "A rubric criterion is missing from the score"
      );

      error.statusCode = 400;
      throw error;
    }
  }

  for (const item of submittedScores) {
    const criterion =
      rubric.criteria.find(
        (c) =>
          c._id.toString() ===
          item.criterionId.toString()
      );

    if (!criterion) {
      const error = new Error(
        "Invalid criterion ID"
      );

      error.statusCode = 400;
      throw error;
    }

    const score = Number(item.score);

    if (
      Number.isNaN(score) ||
      score < 0 ||
      score > criterion.maxScore
    ) {
      const error = new Error(
        `Score for "${criterion.name}" must be between 0 and ${criterion.maxScore}`
      );

      error.statusCode = 400;
      throw error;
    }
  }
};

const calculateScores = (
  rubric,
  submittedScores
) => {
  const criteriaScores =
    rubric.criteria.map((criterion) => {
      const input =
        submittedScores.find(
          (item) =>
            item.criterionId.toString() ===
            criterion._id.toString()
        );

      const score = Number(input.score);

      const percentage =
        (score / criterion.maxScore) * 100;

      const weightedScore =
        (percentage * criterion.weight) /
        100;

      return {
        criterionId: criterion._id,
        name: criterion.name,
        score,
        maxScore: criterion.maxScore,
        weight: criterion.weight,
        weightedScore: Number(
          weightedScore.toFixed(2)
        ),
        comment: input.comment || "",
      };
    });

  const totalScore =
    criteriaScores.reduce(
      (sum, item) =>
        sum + item.weightedScore,
      0
    );

  return {
    criteriaScores,
    totalScore: Number(
      totalScore.toFixed(2)
    ),
  };
};

const createOrUpdateScore = async (
  data,
  user
) => {
  if (user.role !== "judge") {
    const error = new Error(
      "Only judges can submit scores"
    );

    error.statusCode = 403;
    throw error;
  }

  const project = await getProject(
    data.project
  );

  if (project.status !== "submitted") {
    const error = new Error(
      "Only submitted projects can be judged"
    );

    error.statusCode = 400;
    throw error;
  }

  await checkAssignment(
    project._id,
    user._id
  );

  const rubric = await getRubric(
    data.rubric
  );

  if (
    rubric.event.toString() !==
    project.event.toString()
  ) {
    const error = new Error(
      "Rubric does not belong to this project event"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    rubric.track &&
    project.track &&
    rubric.track.toString() !==
      project.track.toString()
  ) {
    const error = new Error(
      "Rubric does not belong to this project's track"
    );

    error.statusCode = 400;
    throw error;
  }

  validateScores(
    rubric,
    data.criteriaScores
  );

  const calculated =
    calculateScores(
      rubric,
      data.criteriaScores
    );

  let score = await Score.findOne({
    project: project._id,
    judge: user._id,
    rubric: rubric._id,
  });

  if (score && score.status === "submitted") {
    const error = new Error(
      "Submitted score cannot be modified"
    );

    error.statusCode = 400;
    throw error;
  }

  if (!score) {
    score = new Score({
      event: project.event,
      project: project._id,
      judge: user._id,
      rubric: rubric._id,
    });
  }

  score.criteriaScores =
    calculated.criteriaScores;

  score.totalScore =
    calculated.totalScore;

  score.overallComment =
    data.overallComment || "";

  if (data.submit === true) {
    score.status = "submitted";
    score.submittedAt = new Date();
  } else {
    score.status = "draft";
    score.submittedAt = null;
  }

  await score.save();

  if (data.submit === true) {
    await JudgeAssignment.findOneAndUpdate(
      {
        project: project._id,
        judge: user._id,
      },
      {
        status: "completed",
      }
    );
  } else {
    await JudgeAssignment.findOneAndUpdate(
      {
        project: project._id,
        judge: user._id,
      },
      {
        status: "in_progress",
      }
    );
  }

  return getScoreById(score._id);
};

const getScoreById = async (scoreId) => {
  const score = await Score.findById(
    scoreId
  )
    .populate(
      "event",
      "title slug"
    )
    .populate(
      "project",
      "title description status"
    )
    .populate(
      "judge",
      "name email"
    )
    .populate(
      "rubric",
      "name criteria totalWeight"
    );

  if (!score) {
    const error = new Error(
      "Score not found"
    );

    error.statusCode = 404;
    throw error;
  }

  return score;
};

const getMyScoreForProject = async (
  projectId,
  judgeId
) => {
  const score = await Score.findOne({
    project: projectId,
    judge: judgeId,
  })
    .populate(
      "project",
      "title description status"
    )
    .populate(
      "rubric",
      "name criteria totalWeight"
    );

  return score;
};

const getMyScores = async (judgeId) => {
  return Score.find({
    judge: judgeId,
  })
    .populate(
      "event",
      "title slug"
    )
    .populate(
      "project",
      "title status"
    )
    .populate(
      "rubric",
      "name"
    )
    .sort({ updatedAt: -1 });
};

const getProjectScores = async (
  projectId,
  user
) => {
  const project = await getProject(
    projectId
  );

  const event =
    await Event.findById(project.event);

  if (!event) {
    const error = new Error(
      "Event not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const isManager =
    user.role === "admin" ||
    event.organizer.toString() ===
      user._id.toString();

  const isAssignedJudge =
    user.role === "judge" &&
    !!(await JudgeAssignment.findOne({
      project: projectId,
      judge: user._id,
    }));

  if (!isManager && !isAssignedJudge) {
    const error = new Error(
      "You are not allowed to view these scores"
    );

    error.statusCode = 403;
    throw error;
  }

  return Score.find({
    project: projectId,
    status: "submitted",
  })
    .populate(
      "judge",
      "name email"
    )
    .populate(
      "rubric",
      "name"
    )
    .sort({ totalScore: -1 });
};

const getEventScores = async (
  eventId,
  user
) => {
  const event =
    await Event.findById(eventId);

  if (!event) {
    const error = new Error(
      "Event not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const isManager =
    user.role === "admin" ||
    event.organizer.toString() ===
      user._id.toString();

  if (!isManager) {
    const error = new Error(
      "Only event organizers or admins can view event scores"
    );

    error.statusCode = 403;
    throw error;
  }

  return Score.find({
    event: eventId,
    status: "submitted",
  })
    .populate(
      "project",
      "title team status"
    )
    .populate(
      "judge",
      "name email"
    )
    .populate(
      "rubric",
      "name"
    )
    .sort({
      totalScore: -1,
    });
};

module.exports = {
  createOrUpdateScore,
  getScoreById,
  getMyScoreForProject,
  getMyScores,
  getProjectScores,
  getEventScores,
};