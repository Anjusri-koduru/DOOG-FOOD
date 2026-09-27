export const ROLES = {
  PARTICIPANT: "participant",
  JUDGE: "judge",
  ORGANIZER: "organizer",
  ADMIN: "admin",
};

export const EVENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  REGISTRATION_OPEN: "registration_open",
  REGISTRATION_CLOSED: "registration_closed",
  JUDGING: "judging",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PROJECT_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  WITHDRAWN: "withdrawn",
};

export const ASSIGNMENT_STATUS = {
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const APP_NAME = "DOGFOOD";

export const APP_DESCRIPTION =
  "Hackathon Management & Judging Platform";