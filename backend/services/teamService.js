const Team = require("../models/Team");
const TeamInvite = require("../models/TeamInvite");
const Event = require("../models/Event");
const User = require("../models/User");

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  return event;
};

const checkRegistrationOpen = (event) => {
  if (
    event.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline)
  ) {
    const error = new Error(
      "Team changes are closed because the registration deadline has passed"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    ["cancelled", "completed", "judging"].includes(
      event.status
    )
  ) {
    const error = new Error(
      "Team changes are not allowed for this event"
    );

    error.statusCode = 400;
    throw error;
  }
};

const findUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User account is inactive");
    error.statusCode = 403;
    throw error;
  }

  return user;
};

const isUserInAnyTeam = async (eventId, userId) => {
  return Team.findOne({
    event: eventId,
    status: "active",
    "members.user": userId,
  });
};

const createTeam = async (data, user) => {
  const event = await getEvent(data.event);

  checkRegistrationOpen(event);

  const existingTeam = await isUserInAnyTeam(
    data.event,
    user._id
  );

  if (existingTeam) {
    const error = new Error(
      "You are already a member of a team for this event"
    );

    error.statusCode = 400;
    throw error;
  }

  if (!data.name || data.name.trim().length < 2) {
    const error = new Error("Team name is required");
    error.statusCode = 400;
    throw error;
  }

  const duplicateTeam = await Team.findOne({
    event: data.event,
    name: data.name.trim(),
    status: "active",
  });

  if (duplicateTeam) {
    const error = new Error(
      "A team with this name already exists for this event"
    );

    error.statusCode = 409;
    throw error;
  }

  const team = await Team.create({
    event: data.event,
    name: data.name.trim(),
    leader: user._id,
    members: [
      {
        user: user._id,
        role: "leader",
      },
    ],
  });

  return Team.findById(team._id)
    .populate(
      "event",
      "title slug minTeamSize maxTeamSize"
    )
    .populate("leader", "name email")
    .populate("members.user", "name email");
};

/*
 * GET ALL TEAMS
 *
 * Used by organizer/admin Manage Teams page.
 *
 * Optional eventId can be supplied to filter teams
 * belonging to one particular event.
 */
const getAllTeams = async (eventId = null) => {
  const query = {
    status: "active",
  };

  if (eventId) {
    query.event = eventId;
  }

  return Team.find(query)
    .populate(
      "event",
      "title slug minTeamSize maxTeamSize registrationDeadline status"
    )
    .populate("leader", "name email")
    .populate("members.user", "name email")
    .sort({
      createdAt: -1,
    });
};

const getMyTeams = async (
  userId,
  eventId = null
) => {
  const query = {
    status: "active",
    "members.user": userId,
  };

  if (eventId) {
    query.event = eventId;
  }

  return Team.find(query)
    .populate(
      "event",
      "title slug minTeamSize maxTeamSize"
    )
    .populate("leader", "name email")
    .populate("members.user", "name email")
    .sort({
      createdAt: -1,
    });
};

const getTeamById = async (teamId) => {
  const team = await Team.findById(teamId)
    .populate(
      "event",
      "title slug minTeamSize maxTeamSize registrationDeadline status"
    )
    .populate("leader", "name email")
    .populate("members.user", "name email");

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  return team;
};

const inviteMember = async (
  teamId,
  inviteeEmail,
  user
) => {
  const team = await Team.findById(teamId).populate(
    "event"
  );

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  if (team.status !== "active") {
    const error = new Error(
      "This team is not active"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    team.leader.toString() !==
    user._id.toString()
  ) {
    const error = new Error(
      "Only the team leader can invite members"
    );

    error.statusCode = 403;
    throw error;
  }

  checkRegistrationOpen(team.event);

  if (
    team.event.maxTeamSize &&
    team.members.length >=
      team.event.maxTeamSize
  ) {
    const error = new Error(
      `Team already reached the maximum size of ${team.event.maxTeamSize}`
    );

    error.statusCode = 400;
    throw error;
  }

  const invitee = await User.findOne({
    email: inviteeEmail.toLowerCase().trim(),
  });

  if (!invitee) {
    const error = new Error(
      "No registered user found with this email"
    );

    error.statusCode = 404;
    throw error;
  }

  if (
    invitee._id.toString() ===
    user._id.toString()
  ) {
    const error = new Error(
      "You cannot invite yourself"
    );

    error.statusCode = 400;
    throw error;
  }

  const alreadyMember = team.members.some(
    (member) =>
      member.user.toString() ===
      invitee._id.toString()
  );

  if (alreadyMember) {
    const error = new Error(
      "This user is already a team member"
    );

    error.statusCode = 400;
    throw error;
  }

  const anotherTeam = await isUserInAnyTeam(
    team.event._id,
    invitee._id
  );

  if (anotherTeam) {
    const error = new Error(
      "This user is already part of another team for this event"
    );

    error.statusCode = 400;
    throw error;
  }

  const existingInvite =
    await TeamInvite.findOne({
      team: team._id,
      invitee: invitee._id,
      status: "pending",
    });

  if (existingInvite) {
    const error = new Error(
      "An invitation is already pending for this user"
    );

    error.statusCode = 409;
    throw error;
  }

  const invite = await TeamInvite.create({
    team: team._id,
    event: team.event._id,
    inviter: user._id,
    invitee: invitee._id,
  });

  return TeamInvite.findById(invite._id)
    .populate("team", "name")
    .populate("event", "title")
    .populate("inviter", "name email")
    .populate("invitee", "name email");
};

const getMyInvites = async (userId) => {
  return TeamInvite.find({
    invitee: userId,
  })
    .populate("team", "name")
    .populate("event", "title slug")
    .populate("inviter", "name email")
    .sort({
      createdAt: -1,
    });
};

const acceptInvite = async (
  inviteId,
  user
) => {
  const invite = await TeamInvite.findById(
    inviteId
  )
    .populate("team")
    .populate("event");

  if (!invite) {
    const error = new Error(
      "Invitation not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (
    invite.invitee.toString() !==
    user._id.toString()
  ) {
    const error = new Error(
      "You cannot accept this invitation"
    );

    error.statusCode = 403;
    throw error;
  }

  if (invite.status !== "pending") {
    const error = new Error(
      "This invitation is no longer pending"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    invite.expiresAt &&
    new Date() >
      new Date(invite.expiresAt)
  ) {
    invite.status = "cancelled";
    await invite.save();

    const error = new Error(
      "This invitation has expired"
    );

    error.statusCode = 400;
    throw error;
  }

  checkRegistrationOpen(invite.event);

  const alreadyInTeam =
    await isUserInAnyTeam(
      invite.event._id,
      user._id
    );

  if (alreadyInTeam) {
    const error = new Error(
      "You are already part of a team for this event"
    );

    error.statusCode = 400;
    throw error;
  }

  const team = await Team.findById(
    invite.team._id
  );

  if (
    !team ||
    team.status !== "active"
  ) {
    const error = new Error(
      "Team is no longer active"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    invite.event.maxTeamSize &&
    team.members.length >=
      invite.event.maxTeamSize
  ) {
    const error = new Error(
      "Team has already reached its maximum size"
    );

    error.statusCode = 400;
    throw error;
  }

  team.members.push({
    user: user._id,
    role: "member",
  });

  await team.save();

  invite.status = "accepted";
  await invite.save();

  return getTeamById(team._id);
};

const rejectInvite = async (
  inviteId,
  user
) => {
  const invite =
    await TeamInvite.findById(inviteId);

  if (!invite) {
    const error = new Error(
      "Invitation not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (
    invite.invitee.toString() !==
    user._id.toString()
  ) {
    const error = new Error(
      "You cannot reject this invitation"
    );

    error.statusCode = 403;
    throw error;
  }

  if (invite.status !== "pending") {
    const error = new Error(
      "This invitation is no longer pending"
    );

    error.statusCode = 400;
    throw error;
  }

  invite.status = "rejected";

  await invite.save();

  return {
    message:
      "Invitation rejected successfully",
  };
};

const removeMember = async (
  teamId,
  memberId,
  user
) => {
  const team =
    await Team.findById(teamId).populate(
      "event"
    );

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    team.leader.toString() !==
    user._id.toString()
  ) {
    const error = new Error(
      "Only the team leader can remove members"
    );

    error.statusCode = 403;
    throw error;
  }

  checkRegistrationOpen(team.event);

  if (
    team.leader.toString() ===
    memberId.toString()
  ) {
    const error = new Error(
      "Team leader cannot be removed"
    );

    error.statusCode = 400;
    throw error;
  }

  const memberExists = team.members.some(
    (member) =>
      member.user.toString() ===
      memberId.toString()
  );

  if (!memberExists) {
    const error = new Error(
      "User is not a member of this team"
    );

    error.statusCode = 404;
    throw error;
  }

  team.members = team.members.filter(
    (member) =>
      member.user.toString() !==
      memberId.toString()
  );

  await team.save();

  return getTeamById(team._id);
};

const leaveTeam = async (
  teamId,
  user
) => {
  const team =
    await Team.findById(teamId).populate(
      "event"
    );

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  checkRegistrationOpen(team.event);

  const isMember = team.members.some(
    (member) =>
      member.user.toString() ===
      user._id.toString()
  );

  if (!isMember) {
    const error = new Error(
      "You are not a member of this team"
    );

    error.statusCode = 403;
    throw error;
  }

  if (
    team.leader.toString() ===
    user._id.toString()
  ) {
    const error = new Error(
      "Team leader cannot leave the team. Transfer leadership or disband the team first."
    );

    error.statusCode = 400;
    throw error;
  }

  team.members = team.members.filter(
    (member) =>
      member.user.toString() !==
      user._id.toString()
  );

  await team.save();

  return {
    message:
      "You left the team successfully",
  };
};

const disbandTeam = async (
  teamId,
  user
) => {
  const team =
    await Team.findById(teamId).populate(
      "event"
    );

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    team.leader.toString() !==
    user._id.toString()
  ) {
    const error = new Error(
      "Only the team leader can disband the team"
    );

    error.statusCode = 403;
    throw error;
  }

  checkRegistrationOpen(team.event);

  if (team.status === "disbanded") {
    const error = new Error(
      "Team is already disbanded"
    );

    error.statusCode = 400;
    throw error;
  }

  team.status = "disbanded";

  await team.save();

  await TeamInvite.updateMany(
    {
      team: team._id,
      status: "pending",
    },
    {
      $set: {
        status: "cancelled",
      },
    }
  );

  return {
    message:
      "Team disbanded successfully",
  };
};

const updateTeam = async (
  teamId,
  data,
  user
) => {
  const team =
    await Team.findById(teamId).populate(
      "event"
    );

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    team.leader.toString() !==
    user._id.toString()
  ) {
    const error = new Error(
      "Only the team leader can update the team"
    );

    error.statusCode = 403;
    throw error;
  }

  checkRegistrationOpen(team.event);

  if (data.name !== undefined) {
    const name = data.name.trim();

    if (name.length < 2) {
      const error = new Error(
        "Team name must contain at least 2 characters"
      );

      error.statusCode = 400;
      throw error;
    }

    const duplicate =
      await Team.findOne({
        event: team.event._id,
        name,
        _id: {
          $ne: team._id,
        },
        status: "active",
      });

    if (duplicate) {
      const error = new Error(
        "Another team already uses this name"
      );

      error.statusCode = 409;
      throw error;
    }

    team.name = name;
  }

  await team.save();

  return getTeamById(team._id);
};

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