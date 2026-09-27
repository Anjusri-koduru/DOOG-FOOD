const Track = require("../models/Track");
const Event = require("../models/Event");

const createSlug = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const generateUniqueSlug = async (eventId, name, excludeId = null) => {
  const baseSlug = createSlug(name) || `track-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      event: eventId,
      slug,
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const exists = await Track.findOne(query);

    if (!exists) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

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

const createTrack = async (data, user) => {
  const event = await getEvent(data.event);

  checkEventManager(event, user);

  const slug = await generateUniqueSlug(data.event, data.name);

  return Track.create({
    event: data.event,
    name: data.name,
    slug,
    description: data.description || "",
    rules: data.rules || "",
    isActive: data.isActive !== undefined ? data.isActive : true,
  });
};

const getTracksByEvent = async (eventId) => {
  await getEvent(eventId);

  return Track.find({
    event: eventId,
    isActive: true,
  }).sort({ createdAt: 1 });
};

const getAllTracksByEvent = async (eventId) => {
  await getEvent(eventId);

  return Track.find({
    event: eventId,
  }).sort({ createdAt: 1 });
};

const getTrackById = async (trackId) => {
  const track = await Track.findById(trackId).populate(
    "event",
    "title slug organizer status"
  );

  if (!track) {
    const error = new Error("Track not found");
    error.statusCode = 404;
    throw error;
  }

  return track;
};

const updateTrack = async (trackId, data, user) => {
  const track = await Track.findById(trackId);

  if (!track) {
    const error = new Error("Track not found");
    error.statusCode = 404;
    throw error;
  }

  const event = await getEvent(track.event);

  checkEventManager(event, user);

  if (data.name && data.name !== track.name) {
    track.name = data.name;
    track.slug = await generateUniqueSlug(
      track.event,
      data.name,
      track._id
    );
  }

  if (data.description !== undefined) {
    track.description = data.description;
  }

  if (data.rules !== undefined) {
    track.rules = data.rules;
  }

  if (data.isActive !== undefined) {
    track.isActive = data.isActive;
  }

  await track.save();

  return track;
};

const deleteTrack = async (trackId, user) => {
  const track = await Track.findById(trackId);

  if (!track) {
    const error = new Error("Track not found");
    error.statusCode = 404;
    throw error;
  }

  const event = await getEvent(track.event);

  checkEventManager(event, user);

  await track.deleteOne();

  return {
    message: "Track deleted successfully",
  };
};

module.exports = {
  createTrack,
  getTracksByEvent,
  getAllTracksByEvent,
  getTrackById,
  updateTrack,
  deleteTrack,
};