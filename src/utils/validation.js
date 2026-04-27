const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname) {
    throw new Error("First name and last name are required");
  } else if (validator.isEmail(email)) {
    throw new Error("Email is required");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    );
  }
};

module.exports = {
  validateSignUpData,
};
