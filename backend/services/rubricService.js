const Rubric = require("../models/Rubric");
const Event = require("../models/Event");
const Track = require("../models/Track");

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  return event;
};

const checkEventManager = (event, user) => {
  if (
    user.role !== "admin" &&
    event.organizer.toString() !== user._id.toString()
  ) {
    const error = new Error(
      "You are not allowed to manage this rubric"
    );

    error.statusCode = 403;
    throw error;
  }
};

const validateCriteria = (criteria) => {
  if (
    !Array.isArray(criteria) ||
    criteria.length === 0
  ) {
    const error = new Error(
      "At least one criterion is required"
    );

    error.statusCode = 400;
    throw error;
  }

  const totalWeight = criteria.reduce(
    (sum, criterion) =>
      sum + Number(criterion.weight || 0),
    0
  );

  if (Math.abs(totalWeight - 100) > 0.01) {
    const error = new Error(
      `Criterion weights must total 100. Current total: ${totalWeight}`
    );

    error.statusCode = 400;
    throw error;
  }

  for (const criterion of criteria) {
    if (!criterion.name) {
      const error = new Error(
        "Every criterion must have a name"
      );

      error.statusCode = 400;
      throw error;
    }

    if (
      Number(criterion.maxScore) <= 0 ||
      Number(criterion.maxScore) > 100
    ) {
      const error = new Error(
        "Criterion maxScore must be between 1 and 100"
      );

      error.statusCode = 400;
      throw error;
    }

    if (
      Number(criterion.weight) < 0 ||
      Number(criterion.weight) > 100
    ) {
      const error = new Error(
        "Criterion weight must be between 0 and 100"
      );

      error.statusCode = 400;
      throw error;
    }
  }
};

const validateTrack = async (
  trackId,
  eventId
) => {
  if (!trackId) {
    return null;
  }

  const track = await Track.findById(trackId);

  if (!track) {
    const error = new Error("Track not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    track.event.toString() !== eventId.toString()
  ) {
    const error = new Error(
      "Track does not belong to this event"
    );

    error.statusCode = 400;
    throw error;
  }

  return track;
};

const createRubric = async (data, user) => {
  const event = await getEvent(data.event);

  checkEventManager(event, user);

  validateCriteria(data.criteria);

  await validateTrack(data.track, data.event);

  const rubric = await Rubric.create({
    event: data.event,
    track: data.track || null,
    name: data.name,
    description: data.description || "",
    criteria: data.criteria,
    totalWeight: 100,
    isActive:
      data.isActive !== undefined
        ? data.isActive
        : true,
    createdBy: user._id,
  });

  return getRubricById(rubric._id);
};

const getRubricById = async (rubricId) => {
  const rubric = await Rubric.findById(rubricId)
    .populate(
      "event",
      "title slug organizer status"
    )
    .populate(
      "track",
      "name slug"
    )
    .populate(
      "createdBy",
      "name email"
    );

  if (!rubric) {
    const error = new Error("Rubric not found");
    error.statusCode = 404;
    throw error;
  }

  return rubric;
};

const getRubricsByEvent = async (
  eventId,
  includeInactive = false
) => {
  await getEvent(eventId);

  const query = {
    event: eventId,
  };

  if (!includeInactive) {
    query.isActive = true;
  }

  return Rubric.find(query)
    .populate("track", "name slug")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

const getRubricsByTrack = async (
  trackId
) => {
  const track = await Track.findById(trackId);

  if (!track) {
    const error = new Error("Track not found");
    error.statusCode = 404;
    throw error;
  }

  return Rubric.find({
    track: trackId,
    isActive: true,
  })
    .populate("event", "title slug")
    .populate("track", "name slug")
    .sort({ createdAt: -1 });
};

const updateRubric = async (
  rubricId,
  data,
  user
) => {
  const rubric = await Rubric.findById(
    rubricId
  );

  if (!rubric) {
    const error = new Error("Rubric not found");
    error.statusCode = 404;
    throw error;
  }

  const event = await getEvent(rubric.event);

  checkEventManager(event, user);

  if (data.criteria !== undefined) {
    validateCriteria(data.criteria);
    rubric.criteria = data.criteria;
  }

  if (data.track !== undefined) {
    await validateTrack(
      data.track,
      rubric.event
    );

    rubric.track = data.track || null;
  }

  if (data.name !== undefined) {
    rubric.name = data.name;
  }

  if (data.description !== undefined) {
    rubric.description = data.description;
  }

  if (data.isActive !== undefined) {
    rubric.isActive = data.isActive;
  }

  await rubric.save();

  return getRubricById(rubric._id);
};

const deleteRubric = async (
  rubricId,
  user
) => {
  const rubric = await Rubric.findById(
    rubricId
  );

  if (!rubric) {
    const error = new Error("Rubric not found");
    error.statusCode = 404;
    throw error;
  }

  const event = await getEvent(rubric.event);

  checkEventManager(event, user);

  await rubric.deleteOne();

  return {
    message: "Rubric deleted successfully",
  };
};

module.exports = {
  createRubric,
  getRubricById,
  getRubricsByEvent,
  getRubricsByTrack,
  updateRubric,
  deleteRubric,
};