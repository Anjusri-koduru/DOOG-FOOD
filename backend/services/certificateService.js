const crypto = require("crypto");

const Certificate = require("../models/Certificate");
const Event = require("../models/Event");
const Team = require("../models/Team");
const Project = require("../models/Project");
const User = require("../models/User");

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

const checkEventManager = async (
  eventId,
  user
) => {
  const event = await getEvent(eventId);

  const allowed =
    user.role === "admin" ||
    (
      user.role === "organizer" &&
      event.organizer.toString() ===
        user._id.toString()
    );

  if (!allowed) {
    throw new Error(
      "Only event organizer or admin can manage certificates"
    );
  }

  return event;
};

const generateCertificateId = () => {
  const randomPart = crypto
    .randomBytes(5)
    .toString("hex")
    .toUpperCase();

  return `DOG-${Date.now()}-${randomPart}`;
};

const getOrCreateCertificate = async ({
  event,
  userId,
  teamId = null,
  projectId = null,
  certificateType = "participation",
  awardTitle = "",
  rank = null,
}) => {
  const existing =
    await Certificate.findOne({
      event: event._id,
      user: userId,
    });

  if (existing) {
    return existing;
  }

  const certificate =
    await Certificate.create({
      certificateId:
        generateCertificateId(),
      event: event._id,
      user: userId,
      team: teamId,
      project: projectId,
      certificateType,
      awardTitle,
      rank,
      issuedAt: new Date(),
      isValid: true,
    });

  return certificate;
};

const getEventParticipants = async (
  eventId
) => {
  const teams = await Team.find({
    event: eventId,
    status: "active",
  }).populate(
    "members.user",
    "_id name email role"
  );

  const users = new Map();

  for (const team of teams) {
    for (const member of team.members) {
      if (
        member.user &&
        member.user._id
      ) {
        users.set(
          member.user._id.toString(),
          {
            userId: member.user._id,
            teamId: team._id,
            teamName: team.name,
          }
        );
      }
    }
  }

  return Array.from(users.values());
};

const generateParticipationCertificates = async (
  eventId,
  user
) => {
  const event = await checkEventManager(
    eventId,
    user
  );

  if (event.status !== "completed") {
    throw new Error(
      "Certificates can be generated only after event completion"
    );
  }

  const participants =
    await getEventParticipants(eventId);

  if (!participants.length) {
    throw new Error(
      "No participants found for this event"
    );
  }

  const certificates = [];

  for (const participant of participants) {
    const certificate =
      await getOrCreateCertificate({
        event,
        userId: participant.userId,
        teamId: participant.teamId,
        certificateType: "participation",
      });

    certificates.push(certificate);
  }

  return {
    eventId: event._id,
    count: certificates.length,
    certificates,
  };
};

const generateWinnerCertificates = async (
  eventId,
  user
) => {
  const event = await checkEventManager(
    eventId,
    user
  );

  if (event.status !== "completed") {
    throw new Error(
      "Winner certificates can be generated only after event completion"
    );
  }

  const projects = await Project.find({
    event: eventId,
    status: "submitted",
  })
    .populate("team")
    .sort({
      createdAt: 1,
    });

  if (!projects.length) {
    throw new Error(
      "No submitted projects found"
    );
  }

  /*
   * Winner selection is intentionally based
   * on already calculated project/ranking data.
   *
   * For now, the first three submitted projects
   * are NOT automatically treated as winners.
   *
   * Organizer/Admin should provide projectId,
   * rank and award information through the
   * winner endpoint.
   */

  return {
    eventId: event._id,
    submittedProjects: projects.length,
    message:
      "Use the winner certificate endpoint to issue certificates for selected projects.",
  };
};

const issueWinnerCertificate = async ({
  eventId,
  projectId,
  rank,
  awardTitle,
  user,
}) => {
  const event = await checkEventManager(
    eventId,
    user
  );

  if (event.status !== "completed") {
    throw new Error(
      "Winner certificates can be issued only after event completion"
    );
  }

  const project =
    await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (
    project.event.toString() !==
    eventId.toString()
  ) {
    throw new Error(
      "Project does not belong to this event"
    );
  }

  if (project.status !== "submitted") {
    throw new Error(
      "Only submitted projects can receive winner certificates"
    );
  }

  if (
    !Number.isInteger(Number(rank)) ||
    Number(rank) < 1
  ) {
    throw new Error(
      "Valid rank is required"
    );
  }

  const team = await Team.findById(
    project.team
  );

  if (!team) {
    throw new Error("Team not found");
  }

  const certificates = [];

  for (const member of team.members) {
    const certificate =
      await getOrCreateCertificate({
        event,
        userId: member.user,
        teamId: team._id,
        projectId: project._id,
        certificateType:
          Number(rank) === 1
            ? "winner"
            : "runner_up",
        awardTitle:
          awardTitle ||
          (
            Number(rank) === 1
              ? "Winner"
              : `Rank ${rank}`
          ),
        rank: Number(rank),
      });

    certificates.push(certificate);
  }

  return {
    project,
    team,
    rank: Number(rank),
    awardTitle:
      awardTitle ||
      (
        Number(rank) === 1
          ? "Winner"
          : `Rank ${rank}`
      ),
    certificates,
  };
};

const getMyCertificates = async (
  userId
) => {
  const certificates =
    await Certificate.find({
      user: userId,
    })
      .populate(
        "event",
        "title slug startDate endDate"
      )
      .populate(
        "team",
        "name"
      )
      .populate(
        "project",
        "title"
      )
      .sort({
        issuedAt: -1,
      });

  return certificates;
};

const getCertificateById = async (
  certificateId
) => {
  const certificate =
    await Certificate.findOne({
      certificateId:
        certificateId.toUpperCase(),
    })
      .populate(
        "event",
        "title slug description startDate endDate"
      )
      .populate(
        "user",
        "name email"
      )
      .populate(
        "team",
        "name"
      )
      .populate(
        "project",
        "title"
      );

  if (!certificate) {
    throw new Error(
      "Certificate not found"
    );
  }

  return certificate;
};

const verifyCertificate = async (
  certificateId
) => {
  const certificate =
    await Certificate.findOne({
      certificateId:
        certificateId.toUpperCase(),
    })
      .populate(
        "event",
        "title slug"
      )
      .populate(
        "user",
        "name"
      )
      .populate(
        "team",
        "name"
      )
      .populate(
        "project",
        "title"
      );

  if (!certificate) {
    return {
      valid: false,
      message: "Certificate not found",
    };
  }

  if (!certificate.isValid) {
    return {
      valid: false,
      message:
        "Certificate has been revoked",
      certificate,
    };
  }

  return {
    valid: true,
    message:
      "Certificate is valid",
    certificate,
  };
};

const revokeCertificate = async (
  certificateId,
  reason,
  user
) => {
  const certificate =
    await Certificate.findOne({
      certificateId:
        certificateId.toUpperCase(),
    });

  if (!certificate) {
    throw new Error(
      "Certificate not found"
    );
  }

  await checkEventManager(
    certificate.event,
    user
  );

  if (!certificate.isValid) {
    throw new Error(
      "Certificate is already revoked"
    );
  }

  certificate.isValid = false;
  certificate.revokedAt = new Date();
  certificate.revokedReason =
    reason || "Certificate revoked by administrator";

  await certificate.save();

  return certificate;
};

const getEventCertificates = async (
  eventId,
  user
) => {
  await checkEventManager(
    eventId,
    user
  );

  return Certificate.find({
    event: eventId,
  })
    .populate(
      "user",
      "name email"
    )
    .populate(
      "team",
      "name"
    )
    .populate(
      "project",
      "title"
    )
    .sort({
      issuedAt: -1,
    });
};

module.exports = {
  generateParticipationCertificates,
  generateWinnerCertificates,
  issueWinnerCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate,
  revokeCertificate,
  getEventCertificates,
};