const AuditLog = require("../models/AuditLog");
const Event = require("../models/Event");

const createAuditLog = async ({
  actor = null,
  action,
  entityType,
  entityId = null,
  event = null,
  description = "",
  metadata = {},
  ipAddress = "",
  userAgent = "",
}) => {
  if (!action) {
    throw new Error(
      "Audit action is required"
    );
  }

  if (!entityType) {
    throw new Error(
      "Audit entity type is required"
    );
  }

  const auditLog = await AuditLog.create({
    actor,
    action,
    entityType,
    entityId,
    event,
    description,
    metadata,
    ipAddress,
    userAgent,
  });

  return auditLog;
};

const getAuditLogById = async (id) => {
  const log = await AuditLog.findById(id)
    .populate(
      "actor",
      "name email role"
    )
    .populate(
      "event",
      "title slug"
    );

  if (!log) {
    throw new Error(
      "Audit log not found"
    );
  }

  return log;
};

const getAuditLogs = async ({
  user,
  eventId,
  actorId,
  entityType,
  action,
  page = 1,
  limit = 20,
}) => {
  const filter = {};

  /*
  |--------------------------------------------------------------------------
  | ADMIN
  |--------------------------------------------------------------------------
  | Admin can see all audit logs.
  | If eventId is supplied, filter by that event.
  |--------------------------------------------------------------------------
  */

  if (user.role === "admin") {
    if (eventId) {
      filter.event = eventId;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ORGANIZER
  |--------------------------------------------------------------------------
  | Organizer can only see logs belonging to events
  | created by that organizer.
  |
  | If eventId is supplied:
  |   -> verify that the event belongs to organizer
  |
  | If eventId is NOT supplied:
  |   -> automatically get all events of organizer
  |   -> show logs belonging to those events
  |--------------------------------------------------------------------------
  */

  else if (user.role === "organizer") {
    if (eventId) {
      const event = await Event.findById(
        eventId
      ).select(
        "_id organizer"
      );

      if (!event) {
        throw new Error(
          "Event not found"
        );
      }

      if (
        event.organizer.toString() !==
        user._id.toString()
      ) {
        throw new Error(
          "You are not allowed to view these audit logs"
        );
      }

      filter.event = event._id;
    } else {
      /*
       * No eventId was provided.
       *
       * Find every event created by this organizer.
       */

      const organizerEvents =
        await Event.find({
          organizer: user._id,
        }).select("_id");

      const eventIds =
        organizerEvents.map(
          (event) => event._id
        );

      /*
       * Organizer has no events.
       * Return empty result instead of throwing
       * "Event ID is required".
       */

      if (eventIds.length === 0) {
        return {
          logs: [],
          pagination: {
            page:
              Math.max(
                Number(page) || 1,
                1
              ),
            limit:
              Math.min(
                Math.max(
                  Number(limit) || 20,
                  1
                ),
                100
              ),
            total: 0,
            pages: 0,
          },
        };
      }

      filter.event = {
        $in: eventIds,
      };
    }
  }

  /*
  |--------------------------------------------------------------------------
  | OTHER ROLES
  |--------------------------------------------------------------------------
  | Non-admin/non-organizer users need an eventId.
  |--------------------------------------------------------------------------
  */

  else {
    if (!eventId) {
      throw new Error(
        "Event ID is required for non-admin users"
      );
    }

    const event = await Event.findById(
      eventId
    );

    if (!event) {
      throw new Error(
        "Event not found"
      );
    }

    filter.event = eventId;
  }

  /*
  |--------------------------------------------------------------------------
  | OPTIONAL FILTERS
  |--------------------------------------------------------------------------
  */

  if (actorId) {
    filter.actor = actorId;
  }

  if (entityType) {
    filter.entityType = entityType;
  }

  if (action) {
    filter.action = action;
  }

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const currentLimit = Math.min(
    Math.max(
      Number(limit) || 20,
      1
    ),
    100
  );

  const skip =
    (currentPage - 1) *
    currentLimit;

  /*
  |--------------------------------------------------------------------------
  | FETCH LOGS
  |--------------------------------------------------------------------------
  */

  const [logs, total] =
    await Promise.all([
      AuditLog.find(filter)
        .populate(
          "actor",
          "name email role"
        )
        .populate(
          "event",
          "title slug"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit),

      AuditLog.countDocuments(
        filter
      ),
    ]);

  return {
    logs,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      pages:
        Math.ceil(
          total / currentLimit
        ),
    },
  };
};

const getEventAuditSummary = async (
  eventId,
  user
) => {
  const event = await Event.findById(
    eventId
  );

  if (!event) {
    throw new Error(
      "Event not found"
    );
  }

  const allowed =
    user.role === "admin" ||
    (
      user.role === "organizer" &&
      event.organizer.toString() ===
        user._id.toString()
    );

  if (!allowed) {
    throw new Error(
      "You are not allowed to view this audit summary"
    );
  }

  const summary =
    await AuditLog.aggregate([
      {
        $match: {
          event: event._id,
        },
      },
      {
        $group: {
          _id: "$action",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

  return summary;
};

module.exports = {
  createAuditLog,
  getAuditLogById,
  getAuditLogs,
  getEventAuditSummary,
};