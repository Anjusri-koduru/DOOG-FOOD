const isValidEmail = (email) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

const validateRegistration = ({
  name,
  email,
  password,
}) => {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name =
      "Name must contain at least 2 characters";
  }

  if (!email || !isValidEmail(email)) {
    errors.email = "Please provide a valid email";
  }

  if (!password || password.length < 8) {
    errors.password =
      "Password must contain at least 8 characters";
  }

  return errors;
};

const validateLogin = ({
  email,
  password,
}) => {
  const errors = {};

  if (!email || !isValidEmail(email)) {
    errors.email = "Please provide a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

module.exports = {
  isValidEmail,
  validateRegistration,
  validateLogin,
};