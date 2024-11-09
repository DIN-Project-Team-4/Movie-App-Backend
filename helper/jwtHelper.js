const jwt = require('jsonwebtoken');

const getAccessToken = ((payload) => {
  // *get toke key and expiration
  const privateToken = process.env.ACCESS_TOKEN_PRIVATE_KEY //|| 'teampetlove.com';
  const privateTokenExp = process.env.JWT_TOKEN_EXP || "20m";
  
  // *Sign the access token
  const accessToken = jwt.sign(payload, privateToken, { expiresIn: privateTokenExp });
  return accessToken;
});

module.exports = {getAccessToken} ;
