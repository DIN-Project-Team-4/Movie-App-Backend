const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds to generate

// hash Password function
const hashPassword = async (password) => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password with the salt
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (error) {
    throw error;
  }
};

//match passwords
const matchPassword = async (password, hashedPassword) => {
  try {
    // match password with the hashed password
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashPassword, matchPassword };
