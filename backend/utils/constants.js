const ROLES = {
  PARTICIPANT: "participant",
  JUDGE: "judge",
  ORGANIZER: "organizer",
  ADMIN: "admin",
};

const USER_ROLES = Object.values(ROLES);

const COOKIE_NAME = "dogfood_token";

const MAX_LOGIN_ATTEMPTS = 5;

module.exports = {
  ROLES,
  USER_ROLES,
  COOKIE_NAME,
  MAX_LOGIN_ATTEMPTS,
};