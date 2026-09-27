const express = require("express");

const router = express.Router();

const {
  getAuditLogsController,
  getAuditLogController,
  getEventAuditSummaryController,
} = require("../controllers/auditController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize =
  require("../middleware/roleMiddleware");

router.use(protect);

/*
|--------------------------------------------------------------------------
| GET ALL / FILTERED AUDIT LOGS
|--------------------------------------------------------------------------
|
| Organizer:
|   /api/audit
|   -> automatically loads logs from organizer's events
|
| Organizer:
|   /api/audit?eventId=EVENT_ID
|   -> loads logs for selected event
|
| Admin:
|   /api/audit
|   -> all audit logs
|
*/

router.get(
  "/",
  authorize(
    "organizer",
    "admin"
  ),
  getAuditLogsController
);

/*
|--------------------------------------------------------------------------
| EVENT AUDIT SUMMARY
|--------------------------------------------------------------------------
*/

router.get(
  "/event/:eventId/summary",
  authorize(
    "organizer",
    "admin"
  ),
  getEventAuditSummaryController
);

/*
|--------------------------------------------------------------------------
| SINGLE AUDIT LOG
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authorize(
    "organizer",
    "admin"
  ),
  getAuditLogController
);

module.exports = router;