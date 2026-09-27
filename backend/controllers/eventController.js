const eventService = require("../services/eventService");
const {
  successResponse,
} = require("../utils/apiResponse");

const createEvent = async (
  req,
  res
) => {
  const event =
    await eventService.createEvent(
      req.user._id,
      req.body
    );

  return successResponse(
    res,
    201,
    "Event created successfully",
    {
      event,
    }
  );
};

const getPublicEvents = async (
  req,
  res
) => {
  const {
    search,
    status,
  } = req.query;

  const page = Math.max(
    parseInt(req.query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      parseInt(req.query.limit) || 12,
      1
    ),
    50
  );

  const result =
    await eventService.getPublicEvents({
      search,
      status,
      page,
      limit,
    });

  return successResponse(
    res,
    200,
    "Public events retrieved successfully",
    result
  );
};

const getAllEvents = async (
  req,
  res
) => {
  const {
    status,
  } = req.query;

  const page = Math.max(
    parseInt(req.query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      parseInt(req.query.limit) || 20,
      1
    ),
    100
  );

  const result =
    await eventService.getAllEvents({
      organizerId:
        req.user.role ===
        "organizer"
          ? req.user._id
          : undefined,

      status,
      page,
      limit,
    });

  return successResponse(
    res,
    200,
    "Events retrieved successfully",
    result
  );
};

const getEventById = async (
  req,
  res
) => {
  const event =
    await eventService.getEventById(
      req.params.id
    );

  /*
  |--------------------------------------------------------------------------
  | Draft/private events cannot be viewed publicly
  |--------------------------------------------------------------------------
  */

  if (
    !event.isPublished ||
    !event.isPublic
  ) {
    const isOwner =
      req.user &&
      event.organizer._id
        .toString() ===
        req.user._id.toString();

    const isAdmin =
      req.user &&
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
  }

  return successResponse(
    res,
    200,
    "Event retrieved successfully",
    {
      event,
    }
  );
};

const getEventBySlug = async (
  req,
  res
) => {
  const event =
    await eventService.getEventBySlug(
      req.params.slug
    );

  if (
    !event.isPublished ||
    !event.isPublic
  ) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  return successResponse(
    res,
    200,
    "Event retrieved successfully",
    {
      event,
    }
  );
};

const updateEvent = async (
  req,
  res
) => {
  const event =
    await eventService.updateEvent(
      req.params.id,
      req.user._id,
      req.user.role,
      req.body
    );

  return successResponse(
    res,
    200,
    "Event updated successfully",
    {
      event,
    }
  );
};

const deleteEvent = async (
  req,
  res
) => {
  await eventService.deleteEvent(
    req.params.id,
    req.user._id,
    req.user.role
  );

  return successResponse(
    res,
    200,
    "Event deleted successfully"
  );
};

const publishEvent = async (
  req,
  res
) => {
  const event =
    await eventService.publishEvent(
      req.params.id,
      req.user._id,
      req.user.role
    );

  return successResponse(
    res,
    200,
    "Event published successfully",
    {
      event,
    }
  );
};

const unpublishEvent = async (
  req,
  res
) => {
  const event =
    await eventService.unpublishEvent(
      req.params.id,
      req.user._id,
      req.user.role
    );

  return successResponse(
    res,
    200,
    "Event unpublished successfully",
    {
      event,
    }
  );
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