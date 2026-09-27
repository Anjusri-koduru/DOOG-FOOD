const Project = require("../models/Project");
const Team = require("../models/Team");
const Event = require("../models/Event");
const Track = require("../models/Track");

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  return event;
};

const getTeam = async (teamId) => {
  const team = await Team.findById(teamId);

  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  return team;
};

const validateSubmissionDeadline = (event) => {
  if (
    event.submissionDeadline &&
    new Date() > new Date(event.submissionDeadline)
  ) {
    const error = new Error(
      "Project submission deadline has passed"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    ["cancelled", "completed"].includes(event.status)
  ) {
    const error = new Error(
      "Project submission is not allowed for this event"
    );

    error.statusCode = 400;
    throw error;
  }
};

const validateTrack = async (trackId, eventId) => {
  if (!trackId) {
    return null;
  }

  const track = await Track.findById(trackId);

  if (!track) {
    const error = new Error("Track not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    track.event.toString() !==
    eventId.toString()
  ) {
    const error = new Error(
      "Selected track does not belong to this event"
    );

    error.statusCode = 400;
    throw error;
  }

  if (!track.isActive) {
    const error = new Error(
      "Selected track is inactive"
    );

    error.statusCode = 400;
    throw error;
  }

  return track;
};

const checkTeamMember = (team, userId) => {
  const isMember = team.members.some(
    (member) =>
      member.user.toString() ===
      userId.toString()
  );

  if (!isMember) {
    const error = new Error(
      "You must be a member of the team"
    );

    error.statusCode = 403;
    throw error;
  }
};

const createProject = async (data, user) => {
  const event = await getEvent(data.event);
  const team = await getTeam(data.team);

  if (
    team.event.toString() !==
    event._id.toString()
  ) {
    const error = new Error(
      "Team does not belong to this event"
    );

    error.statusCode = 400;
    throw error;
  }

  checkTeamMember(team, user._id);

  validateSubmissionDeadline(event);

  const existingProject = await Project.findOne({
    team: team._id,
  });

  if (existingProject) {
    const error = new Error(
      "This team already has a project"
    );

    error.statusCode = 409;
    throw error;
  }

  await validateTrack(
    data.track,
    event._id
  );

  const project = await Project.create({
    event: event._id,
    team: team._id,
    track: data.track || null,
    title: data.title,
    description: data.description,
    technologies: data.technologies || [],
    repositoryUrl: data.repositoryUrl || "",
    demoUrl: data.demoUrl || "",
    videoUrl: data.videoUrl || "",
    presentationUrl:
      data.presentationUrl || "",
    screenshots: data.screenshots || [],
    status: "draft",
    createdBy: user._id,
  });

  return getProjectById(project._id);
};

const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId)
    .populate(
      "event",
      "title slug submissionDeadline status"
    )
    .populate(
      "team",
      "name leader members"
    )
    .populate(
      "track",
      "name slug description"
    )
    .populate(
      "createdBy",
      "name email"
    );

  if (!project) {
    const error = new Error(
      "Project not found"
    );

    error.statusCode = 404;
    throw error;
  }

  return project;
};

const getMyProject = async (
  userId,
  eventId = null
) => {
  const teams = await Team.find({
    "members.user": userId,
    status: "active",
    ...(eventId
      ? { event: eventId }
      : {}),
  }).select("_id");

  const teamIds = teams.map(
    (team) => team._id
  );

  const project = await Project.findOne({
    team: { $in: teamIds },
  })
    .populate(
      "event",
      "title slug submissionDeadline status"
    )
    .populate(
      "team",
      "name leader members"
    )
    .populate(
      "track",
      "name slug"
    )
    .populate(
      "createdBy",
      "name email"
    );

  return project;
};

/*
 * Get all projects.
 * Used by Admin project management.
 */
const getAllProjects = async () => {
  return Project.find({})
    .populate(
      "event",
      "title slug status"
    )
    .populate(
      "team",
      "name leader members"
    )
    .populate(
      "track",
      "name slug"
    )
    .populate(
      "createdBy",
      "name email"
    )
    .sort({ createdAt: -1 });
};

const getProjectsByEvent = async (
  eventId
) => {
  await getEvent(eventId);

  return Project.find({
    event: eventId,
  })
    .populate(
      "team",
      "name leader"
    )
    .populate(
      "track",
      "name slug"
    )
    .populate(
      "createdBy",
      "name email"
    )
    .sort({ createdAt: -1 });
};

const updateProject = async (
  projectId,
  data,
  user
) => {
  const project =
    await Project.findById(projectId);

  if (!project) {
    const error = new Error(
      "Project not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const team = await getTeam(
    project.team
  );

  checkTeamMember(
    team,
    user._id
  );

  if (project.status === "submitted") {
    const error = new Error(
      "Submitted project cannot be edited. Withdraw it first."
    );

    error.statusCode = 400;
    throw error;
  }

  const event = await getEvent(
    project.event
  );

  validateSubmissionDeadline(event);

  if (data.track !== undefined) {
    await validateTrack(
      data.track,
      event._id
    );

    project.track =
      data.track || null;
  }

  if (data.title !== undefined) {
    project.title = data.title;
  }

  if (data.description !== undefined) {
    project.description =
      data.description;
  }

  if (data.technologies !== undefined) {
    project.technologies =
      data.technologies;
  }

  if (data.repositoryUrl !== undefined) {
    project.repositoryUrl =
      data.repositoryUrl;
  }

  if (data.demoUrl !== undefined) {
    project.demoUrl = data.demoUrl;
  }

  if (data.videoUrl !== undefined) {
    project.videoUrl =
      data.videoUrl;
  }

  if (
    data.presentationUrl !==
    undefined
  ) {
    project.presentationUrl =
      data.presentationUrl;
  }

  if (data.screenshots !== undefined) {
    project.screenshots =
      data.screenshots;
  }

  await project.save();

  return getProjectById(
    project._id
  );
};

const submitProject = async (
  projectId,
  user
) => {
  const project =
    await Project.findById(projectId);

  if (!project) {
    const error = new Error(
      "Project not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const team = await getTeam(
    project.team
  );

  checkTeamMember(
    team,
    user._id
  );

  const event = await getEvent(
    project.event
  );

  validateSubmissionDeadline(event);

  if (project.status === "submitted") {
    const error = new Error(
      "Project is already submitted"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    !project.title ||
    project.title.trim().length < 3
  ) {
    const error = new Error(
      "Project title is required"
    );

    error.statusCode = 400;
    throw error;
  }

  if (
    !project.description ||
    project.description.trim().length < 20
  ) {
    const error = new Error(
      "Project description must contain at least 20 characters"
    );

    error.statusCode = 400;
    throw error;
  }

  if (!project.track) {
    const error = new Error(
      "Please select a track before submitting"
    );

    error.statusCode = 400;
    throw error;
  }

  project.status = "submitted";
  project.submittedAt = new Date();

  await project.save();

  return getProjectById(
    project._id
  );
};

const withdrawProject = async (
  projectId,
  user
) => {
  const project =
    await Project.findById(projectId);

  if (!project) {
    const error = new Error(
      "Project not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const team = await getTeam(
    project.team
  );

  checkTeamMember(
    team,
    user._id
  );

  if (project.status !== "submitted") {
    const error = new Error(
      "Only submitted projects can be withdrawn"
    );

    error.statusCode = 400;
    throw error;
  }

  project.status = "withdrawn";

  await project.save();

  return getProjectById(
    project._id
  );
};

module.exports = {
  createProject,
  getProjectById,
  getMyProject,
  getAllProjects,
  getProjectsByEvent,
  updateProject,
  submitProject,
  withdrawProject,
};