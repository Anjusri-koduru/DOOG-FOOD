const Score = require("../models/Score");
const Project = require("../models/Project");
const Event = require("../models/Event");
const NormalizedScore = require("../models/NormalizedScore");

const checkEventManager = async (eventId, user) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const isManager =
    user.role === "admin" ||
    event.organizer.toString() === user._id.toString();

  if (!isManager) {
    throw new Error("Only event organizer or admin can normalize scores");
  }

  return event;
};

const calculateMean = (values) => {
  if (!values.length) return 0;

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
};

const calculateStandardDeviation = (values, mean) => {
  if (values.length <= 1) {
    return 0;
  }

  const variance =
    values.reduce(
      (sum, value) => sum + Math.pow(value - mean, 2),
      0
    ) / values.length;

  return Math.sqrt(variance);
};

const normalizeValue = (
  originalScore,
  mean,
  standardDeviation
) => {
  // If judge gave same score to all projects,
  // use original score because z-score cannot be calculated.
  if (standardDeviation === 0) {
    return Number(originalScore.toFixed(2));
  }

  const zScore =
    (originalScore - mean) / standardDeviation;

  // Convert z-score into a 0-100 style score.
  const normalized = 50 + zScore * 10;

  return Number(
    Math.max(0, Math.min(100, normalized)).toFixed(2)
  );
};

const normalizeEventScores = async (eventId, user) => {
  const event = await checkEventManager(eventId, user);

  const scores = await Score.find({
    event: eventId,
    status: "submitted",
  })
    .populate("project", "title team track")
    .populate("judge", "name email");

  if (!scores.length) {
    throw new Error(
      "No submitted scores found for this event"
    );
  }

  const judgeScores = {};

  for (const score of scores) {
    const judgeId = score.judge._id.toString();

    if (!judgeScores[judgeId]) {
      judgeScores[judgeId] = [];
    }

    judgeScores[judgeId].push(score.totalScore);
  }

  const normalizedResults = [];

  for (const score of scores) {
    const judgeId = score.judge._id.toString();

    const values = judgeScores[judgeId];

    const mean = calculateMean(values);

    const standardDeviation =
      calculateStandardDeviation(values, mean);

    const normalizedScore = normalizeValue(
      score.totalScore,
      mean,
      standardDeviation
    );

    const saved = await NormalizedScore.findOneAndUpdate(
      {
        event: eventId,
        project: score.project._id,
        judge: score.judge._id,
      },
      {
        event: eventId,
        project: score.project._id,
        judge: score.judge._id,
        originalScore: score.totalScore,
        judgeMean: Number(mean.toFixed(2)),
        judgeStandardDeviation: Number(
          standardDeviation.toFixed(2)
        ),
        normalizedScore,
        method: "z-score",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    normalizedResults.push(saved);
  }

  return {
    event,
    count: normalizedResults.length,
    results: normalizedResults,
  };
};

const getProjectNormalizedScores = async (
  projectId,
  user
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const event = await Event.findById(project.event);

  if (!event) {
    throw new Error("Event not found");
  }

  const isManager =
    user.role === "admin" ||
    event.organizer.toString() === user._id.toString();

  if (!isManager) {
    throw new Error(
      "Only event organizer or admin can view normalized scores"
    );
  }

  const scores = await NormalizedScore.find({
    project: projectId,
  })
    .populate("judge", "name email")
    .sort({ normalizedScore: -1 });

  const average =
    scores.length > 0
      ? scores.reduce(
          (sum, score) => sum + score.normalizedScore,
          0
        ) / scores.length
      : 0;

  return {
    project,
    judgeScores: scores,
    finalNormalizedScore: Number(
      average.toFixed(2)
    ),
  };
};

const getEventNormalizedScores = async (
  eventId,
  user
) => {
  await checkEventManager(eventId, user);

  const scores = await NormalizedScore.find({
    event: eventId,
  })
    .populate("project", "title team track")
    .populate("judge", "name email")
    .sort({ normalizedScore: -1 });

  const projectMap = {};

  for (const score of scores) {
    const projectId = score.project._id.toString();

    if (!projectMap[projectId]) {
      projectMap[projectId] = {
        project: score.project,
        scores: [],
        total: 0,
      };
    }

    projectMap[projectId].scores.push(score);
    projectMap[projectId].total +=
      score.normalizedScore;
  }

  const projects = Object.values(projectMap)
    .map((item) => ({
      project: item.project,
      judgeScores: item.scores,
      finalNormalizedScore:
        item.scores.length > 0
          ? Number(
              (
                item.total / item.scores.length
              ).toFixed(2)
            )
          : 0,
    }))
    .sort(
      (a, b) =>
        b.finalNormalizedScore -
        a.finalNormalizedScore
    );

  return projects;
};

module.exports = {
  normalizeEventScores,
  getProjectNormalizedScores,
  getEventNormalizedScores,
};