const Event = require("../models/Event");

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const generateUniqueSlug = async (
  title
) => {
  const baseSlug = createSlug(title);

  let slug = baseSlug;
  let counter = 1;

  while (
    await Event.exists({ slug })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

const createEvent = async (
  organizerId,
  data
) => {
  const slug =
    await generateUniqueSlug(
      data.title
    );

  const event =
    await Event.create({
      ...data,
      slug,
      organizer: organizerId,
    });

  return event;
};

const getPublicEvents = async ({
  search,
  status,
  page = 1,
  limit = 12,
}) => {
  const filter = {
    isPublic: true,
    isPublished: true,
  };

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        tags: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [events, total] =
    await Promise.all([
      Event.find(filter)
        .populate(
          "organizer",
          "name email"
        )
        .sort({
          startDate: 1,
        })
        .skip(skip)
        .limit(limit),

      Event.countDocuments(filter),
    ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};

const getAllEvents = async ({
  organizerId,
  status,
  page = 1,
  limit = 20,
}) => {
  const filter = {};

  if (organizerId) {
    filter.organizer = organizerId;
  }

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [events, total] =
    await Promise.all([
      Event.find(filter)
        .populate(
          "organizer",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Event.countDocuments(filter),
    ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};

const getEventById = async (
  eventId
) => {
  const event =
    await Event.findById(eventId)
      .populate(
        "organizer",
        "name email role"
      );

  if (!event) {
    const error = new Error(
      "Event not found"
    );

    error.statusCode = 404;
    throw error;
  }

  return event;
};

const getEventBySlug = async (
  slug
) => {
  const event =
    await Event.findOne({
      slug,
    }).populate(
      "organizer",
      "name email role"
    );

  if (!event) {
    const error = new Error(
      "Event not found"
    );

    error.statusCode = 404;
    throw error;
  }

  return event;
};

const updateEvent = async (
  eventId,
  userId,
  userRole,
  data
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

  const isOwner =
    event.organizer.toString() ===
    userId.toString();

  const isAdmin =
    userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error(
      "You can only update your own events"
    );

    error.statusCode = 403;
    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent accidental organizer replacement
  |--------------------------------------------------------------------------
  */

  delete data.organizer;
  delete data.slug;

  Object.assign(event, data);

  await event.save();

  return event;
};

const deleteEvent = async (
  eventId,
  userId,
  userRole
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

  const isOwner =
    event.organizer.toString() ===
    userId.toString();

  const isAdmin =
    userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error(
      "You can only delete your own events"
    );

    error.statusCode = 403;
    throw error;
  }

  await event.deleteOne();

  return true;
};

const publishEvent = async (
  eventId,
  userId,
  userRole
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

  const isOwner =
    event.organizer.toString() ===
    userId.toString();

  const isAdmin =
    userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error(
      "You do not have permission to publish this event"
    );

    error.statusCode = 403;
    throw error;
  }

  event.isPublished = true;

  if (event.status === "draft") {
    event.status =
      "registration_open";
  }

  await event.save();

  return event;
};

const unpublishEvent = async (
  eventId,
  userId,
  userRole
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

  const isOwner =
    event.organizer.toString() ===
    userId.toString();

  const isAdmin =
    userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error(
      "You do not have permission to unpublish this event"
    );

    error.statusCode = 403;
    throw error;
  }

  event.isPublished = false;
  event.status = "draft";

  await event.save();

  return event;
};

module.exports = {
  createEvent,
  getPublicEvents,
  getAllEvents,
  getEventById,
  getEventBySlug,
  updateEvent,
  deleteEvent,
  publishEvent,
  unpublishEvent,
};