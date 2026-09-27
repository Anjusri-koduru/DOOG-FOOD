const asyncHandler = require("../utils/asyncHandler");

const {
  getAuditLogById,
  getAuditLogs,
  getEventAuditSummary,
} = require("../services/auditService");

const getAuditLogsController =
  asyncHandler(async (req, res) => {
    const result =
      await getAuditLogs({
        user: req.user,
        eventId:
          req.query.eventId,
        actorId:
          req.query.actorId,
        entityType:
          req.query.entityType,
        action:
          req.query.action,
        page:
          req.query.page,
        limit:
          req.query.limit,
      });

    res.status(200).json({
      success: true,
      data: result,
    });
  });

const getAuditLogController =
  asyncHandler(async (req, res) => {
    const log =
      await getAuditLogById(
        req.params.id
      );

    const isAdmin =
      req.user.role === "admin";

    /*
     * getAuditLogById already populates
     * the event document.
     *
     * So organizer ownership can be
     * checked here.
     */

    const isOrganizer =
      req.user.role === "organizer" &&
      log.event &&
      log.event.organizer &&
      log.event.organizer.toString() ===
        req.user._id.toString();

    /*
     * Since event was populated only with
     * title and slug in getAuditLogById,
     * organizer may not be available there.
     *
     * Therefore, if organizer is checking
     * a single log, fetch the original event
     * ownership separately.
     */

    let organizerAllowed = false;

    if (
      req.user.role === "organizer" &&
      log.event
    ) {
      const Event =
        require("../models/Event");

      const event =
        await Event.findById(
          log.event._id
        ).select(
          "organizer"
        );

      if (
        event &&
        event.organizer.toString() ===
          req.user._id.toString()
      ) {
        organizerAllowed = true;
      }
    }

    if (
      !isAdmin &&
      !isOrganizer &&
      !organizerAllowed
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to view this audit log",
      });
    }

    res.status(200).json({
      success: true,
      data: log,
    });
  });

const getEventAuditSummaryController =
  asyncHandler(async (req, res) => {
    const summary =
      await getEventAuditSummary(
        req.params.eventId,
        req.user
      );

    res.status(200).json({
      success: true,
      data: summary,
    });
  });

module.exports = {
  getAuditLogsController,
  getAuditLogController,
  getEventAuditSummaryController,
};