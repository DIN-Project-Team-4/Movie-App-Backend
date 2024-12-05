const jwt = require('jsonwebtoken');

const getAccessToken = ((payload) => {
  // *get toke key and expiration
  const privateToken = process.env.ACCESS_TOKEN_PRIVATE_KEY //|| 'teampetlove.com';
  const privateTokenExp = process.env.JWT_TOKEN_EXP || "60m";
  
  // *Sign the access token
  const accessToken = jwt.sign(payload, privateToken, { expiresIn: privateTokenExp });
  return accessToken;
});

// Function to generate a refresh token
const getRefreshToken = (payload) => {
  const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
  const expiresIn = process.env.REFRESH_TOKEN_EXP || '14d';
  
  return jwt.sign(payload, privateKey, { expiresIn });
};

const validateRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_PRIVATE_KEY);
};

module.exports = { getAccessToken, getRefreshToken,validateRefreshToken  } ;
