const Prize = require("../models/Prize");
const Event = require("../models/Event");
const Track = require("../models/Track");

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

const checkEventManager = (event, user) => {
  if (
    user.role !== "admin" &&
    event.organizer.toString() !== user._id.toString()
  ) {
    const error = new Error("You are not allowed to manage this event");
    error.statusCode = 403;
    throw error;
  }
};

const createPrize = async (data, user) => {
  const event = await getEvent(data.event);

  checkEventManager(event, user);

  if (data.track) {
    const track = await Track.findById(data.track);

    if (!track) {
      const error = new Error("Track not found");
      error.statusCode = 404;
      throw error;
    }

    if (track.event.toString() !== data.event.toString()) {
      const error = new Error(
        "Track does not belong to this event"
      );
      error.statusCode = 400;
      throw error;
    }
  }

  return Prize.create({
    event: data.event,
    track: data.track || null,
    title: data.title,
    description: data.description || "",
    rank: data.rank,
    amount: data.amount || 0,
    currency: data.currency || "INR",
    quantity: data.quantity || 1,
    isActive: data.isActive !== undefined ? data.isActive : true,
  });
};

const getPrizesByEvent = async (eventId) => {
  await getEvent(eventId);

  return Prize.find({
    event: eventId,
    isActive: true,
  })
    .populate("track", "name slug")
    .sort({ rank: 1, createdAt: 1 });
};

const getAllPrizesByEvent = async (eventId) => {
  await getEvent(eventId);

  return Prize.find({
    event: eventId,
  })
    .populate("track", "name slug")
    .sort({ rank: 1, createdAt: 1 });
};

const getPrizeById = async (prizeId) => {
  const prize = await Prize.findById(prizeId)
    .populate("event", "title slug organizer")
    .populate("track", "name slug");

  if (!prize) {
    const error = new Error("Prize not found");
    error.statusCode = 404;
    throw error;
  }

  return prize;
};

const updatePrize = async (prizeId, data, user) => {
  const prize = await Prize.findById(prizeId);

  if (!prize) {
    const error = new Error("Prize not found");
    error.statusCode = 404;
    throw error;
  }

  const event = await getEvent(prize.event);

  checkEventManager(event, user);

  if (data.track !== undefined && data.track !== null) {
    const track = await Track.findById(data.track);

    if (!track) {
      const error = new Error("Track not found");
      error.statusCode = 404;
      throw error;
    }

    if (track.event.toString() !== prize.event.toString()) {
      const error = new Error(
        "Track does not belong to this event"
      );
      error.statusCode = 400;
      throw error;
    }

    prize.track = data.track;
  }

  if (data.track === null) {
    prize.track = null;
  }

  if (data.title !== undefined) prize.title = data.title;
  if (data.description !== undefined)
    prize.description = data.description;
  if (data.rank !== undefined) prize.rank = data.rank;
  if (data.amount !== undefined) prize.amount = data.amount;
  if (data.currency !== undefined)
    prize.currency = data.currency;
  if (data.quantity !== undefined)
    prize.quantity = data.quantity;
  if (data.isActive !== undefined)
    prize.isActive = data.isActive;

  await prize.save();

  return prize;
};

const deletePrize = async (prizeId, user) => {
  const prize = await Prize.findById(prizeId);

  if (!prize) {
    const error = new Error("Prize not found");
    error.statusCode = 404;
    throw error;
  }

  const event = await getEvent(prize.event);

  checkEventManager(event, user);

  await prize.deleteOne();

  return {
    message: "Prize deleted successfully",
  };
};

module.exports = {
  createPrize,
  getPrizesByEvent,
  getAllPrizesByEvent,
  getPrizeById,
  updatePrize,
  deletePrize,
};