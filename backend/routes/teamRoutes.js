const express = require("express");

const router = express.Router();

const {
  createTeam,
  getAllTeams,
  getMyTeams,
  getTeamById,
  inviteMember,
  getMyInvites,
  acceptInvite,
  rejectInvite,
  removeMember,
  leaveTeam,
  disbandTeam,
  updateTeam,
} = require("../controllers/teamController");

const {
  protect,
} = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

router.use(protect);

/*
 * Organizer/Admin:
 * View all active teams.
 *
 * Optional:
 * /api/teams?eventId=EVENT_ID
 */
router.get(
  "/",
  authorize("organizer", "admin"),
  getAllTeams
);

/*
 * Participant:
 * View teams where current user is a member.
 *
 * Optional:
 * /api/teams/my?eventId=EVENT_ID
 */
router.get(
  "/my",
  getMyTeams
);

router.get(
  "/invites",
  getMyInvites
);

router.post(
  "/",
  createTeam
);

/*
 * IMPORTANT:
 * These specific routes must stay ABOVE /:id
 * so "invites" does not get treated as an ID.
 */
router.patch(
  "/invites/:inviteId/accept",
  acceptInvite
);

router.patch(
  "/invites/:inviteId/reject",
  rejectInvite
);

router.get(
  "/:id",
  getTeamById
);

router.put(
  "/:id",
  updateTeam
);

router.post(
  "/:id/invites",
  inviteMember
);

router.delete(
  "/:id/members/:memberId",
  removeMember
);

router.post(
  "/:id/leave",
  leaveTeam
);

router.delete(
  "/:id",
  disbandTeam
);

module.exports = router;