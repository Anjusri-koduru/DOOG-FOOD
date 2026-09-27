const Vote = require("../models/Vote");
const Project = require("../models/Project");
const Event = require("../models/Event");
const Team = require("../models/Team");

const getProject = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

const isTeamMember = async (teamId, userId) => {
  const team = await Team.findById(teamId);

  if (!team) {
    return false;
  }

  const member = team.members.some(
    (member) =>
      member.user.toString() === userId.toString()
  );

  return member;
};

const checkVotingAllowed = async (project, user) => {
  if (project.status !== "submitted") {
    throw new Error(
      "Only submitted projects can receive votes"
    );
  }

  const event = await getEvent(project.event);

  if (
    event.status === "cancelled" ||
    event.status === "completed"
  ) {
    throw new Error(
      "Voting is not available for this event"
    );
  }

  // Organizer/admin can manage/view voting,
  // but normal voting is for participants/judges.
  if (
    !["participant", "judge", "organizer", "admin"].includes(
      user.role
    )
  ) {
    throw new Error("You are not allowed to vote");
  }

  const member = await isTeamMember(
    project.team,
    user._id
  );

  if (member) {
    throw new Error(
      "You cannot vote for your own team project"
    );
  }

  return event;
};

const createVote = async (projectId, user) => {
  const project = await getProject(projectId);

  const event = await checkVotingAllowed(
    project,
    user
  );

  const existingVote = await Vote.findOne({
    project: project._id,
    voter: user._id,
  });

  if (existingVote) {
    throw new Error(
      "You have already voted for this project"
    );
  }

  const vote = await Vote.create({
    event: event._id,
    project: project._id,
    voter: user._id,
  });

  return Vote.findById(vote._id).populate(
    "voter",
    "name email"
  );
};

const removeVote = async (projectId, user) => {
  const project = await getProject(projectId);

  const vote = await Vote.findOneAndDelete({
    project: project._id,
    voter: user._id,
  });

  if (!vote) {
    throw new Error(
      "You have not voted for this project"
    );
  }

  return vote;
};

const getMyVote = async (projectId, user) => {
  await getProject(projectId);

  const vote = await Vote.findOne({
    project: projectId,
    voter: user._id,
  });

  return {
    hasVoted: !!vote,
    vote,
  };
};

const getProjectVoteCount = async (projectId) => {
  const project = await getProject(projectId);

  const count = await Vote.countDocuments({
    project: project._id,
  });

  return {
    projectId: project._id,
    voteCount: count,
  };
};

const getEventVotingResults = async (
  eventId,
  user
) => {
  const event = await getEvent(eventId);

  const isManager =
    user.role === "admin" ||
    (
      user.role === "organizer" &&
      event.organizer.toString() ===
        user._id.toString()
    );

  if (!isManager) {
    throw new Error(
      "Only event organizer or admin can view voting results"
    );
  }

  const results = await Vote.aggregate([
    {
      $match: {
        event: event._id,
      },
    },
    {
      $group: {
        _id: "$project",
        voteCount: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        voteCount: -1,
      },
    },
  ]);

  const projectIds = results.map(
    (item) => item._id
  );

  const projects = await Project.find({
    _id: {
      $in: projectIds,
    },
  })
    .populate("team", "name")
    .populate("track", "name");

  const projectMap = {};

  projects.forEach((project) => {
    projectMap[project._id.toString()] =
      project;
  });

  return results.map((result, index) => ({
    rank: index + 1,
    project: projectMap[
      result._id.toString()
    ] || null,
    voteCount: result.voteCount,
  }));
};

module.exports = {
  createVote,
  removeVote,
  getMyVote,
  getProjectVoteCount,
  getEventVotingResults,
};