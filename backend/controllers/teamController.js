const asyncHandler = require("../utils/asyncHandler");
const teamService = require("../services/teamService");
const User = require("../models/User");

const createTeam = asyncHandler(
  async (req, res) => {
    const team =
      await teamService.createTeam(
        req.body,
        req.user
      );

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  }
);

const getAllTeams = asyncHandler(
  async (req, res) => {
    const teams =
      await teamService.getAllTeams(
        req.query.eventId || null
      );

    res.json({
      success: true,
      data: teams,
    });
  }
);

const getMyTeams = asyncHandler(
  async (req, res) => {
    const teams =
      await teamService.getMyTeams(
        req.user._id,
        req.query.eventId || null
      );

    res.json({
      success: true,
      data: teams,
    });
  }
);

const getTeamById = asyncHandler(
  async (req, res) => {
    const team =
      await teamService.getTeamById(
        req.params.id
      );

    res.json({
      success: true,
      data: team,
    });
  }
);

const inviteMember = asyncHandler(
  async (req, res) => {
    let email = req.body.email;

    if (!email && req.body.userId) {
      const user = await User.findById(
        req.body.userId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      email = user.email;
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Invitee email or userId is required",
      });
    }

    const invite =
      await teamService.inviteMember(
        req.params.id,
        email,
        req.user
      );

    res.status(201).json({
      success: true,
      message:
        "Team invitation sent successfully",
      data: invite,
    });
  }
);

const getMyInvites = asyncHandler(
  async (req, res) => {
    const invites =
      await teamService.getMyInvites(
        req.user._id
      );

    res.json({
      success: true,
      data: invites,
    });
  }
);

const acceptInvite = asyncHandler(
  async (req, res) => {
    const team =
      await teamService.acceptInvite(
        req.params.inviteId,
        req.user
      );

    res.json({
      success: true,
      message:
        "Invitation accepted successfully",
      data: team,
    });
  }
);

const rejectInvite = asyncHandler(
  async (req, res) => {
    const result =
      await teamService.rejectInvite(
        req.params.inviteId,
        req.user
      );

    res.json({
      success: true,
      ...result,
    });
  }
);

const removeMember = asyncHandler(
  async (req, res) => {
    const team =
      await teamService.removeMember(
        req.params.id,
        req.params.memberId,
        req.user
      );

    res.json({
      success: true,
      message:
        "Member removed successfully",
      data: team,
    });
  }
);

const leaveTeam = asyncHandler(
  async (req, res) => {
    const result =
      await teamService.leaveTeam(
        req.params.id,
        req.user
      );

    res.json({
      success: true,
      ...result,
    });
  }
);

const disbandTeam = asyncHandler(
  async (req, res) => {
    const result =
      await teamService.disbandTeam(
        req.params.id,
        req.user
      );

    res.json({
      success: true,
      ...result,
    });
  }
);

const updateTeam = asyncHandler(
  async (req, res) => {
    const team =
      await teamService.updateTeam(
        req.params.id,
        req.body,
        req.user
      );

    res.json({
      success: true,
      message:
        "Team updated successfully",
      data: team,
    });
  }
);

module.exports = {
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
};