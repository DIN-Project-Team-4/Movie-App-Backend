const express = require('express');
const jwt = require('jsonwebtoken');

// Define jwtMiddleware as a function that returns another function
const AuthMiddleware = ((req, res, next) => {
	// Get secret key
	const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY
	// Add refresh token secret key
	const refreshKey = process.env.REFRESH_TOKEN_PRIVATE_KEY; 

	const cookie = req.headers.cookie;
	
	const accessToken = cookie.split('=')[1];
	const refreshToken = cookie.split('=')[1];

	// Check for access token, empty or not
	if (!accessToken) {
		return res.status(401).json({ error: 'Unauthorized access. Invalid or missing token.' });
	}

	try {
		// Verify token using the provided secret key
		const decodedToken = jwt.verify(accessToken, secretKey);

		//assign userId to env variable to access from other modules
		process.env.USER_ID = decodedToken.userId;
		process.env.USER_EMAIL = decodedToken.userEmail;
		process.env.USER_NAME = decodedToken.userName;


		if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
			return res.status(401).json({ error: 'Unauthorized access. Token has expired.' });
		}

		// Move to the next middleware or route handler
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError" && refreshToken) {
			// If access token expired, verify and refresh using the refresh token
			try {
			  const decodedRefreshToken = jwt.verify(refreshToken, refreshKey);
	  
			  // Generate a new access token
			  const newAccessToken = jwt.sign(
				{
				  userId: decodedRefreshToken.userId,
				  userEmail: decodedRefreshToken.userEmail,
				  userName: decodedRefreshToken.userName,
				},
				secretKey,
				{ expiresIn: '15m' } // Short lifespan for the access token
			  );
	  
			  // Set the new access token in the cookie
			  res.cookie('accessToken', newAccessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
				sameSite: 'strict',
			  });
	  
			  // Proceed with the request
			  process.env.USER_ID = decodedRefreshToken.userId;
			  process.env.USER_EMAIL = decodedRefreshToken.userEmail;
			  process.env.USER_NAME = decodedRefreshToken.userName;
			  return next();
			} catch (refreshError) {
			  return res.status(401).json({ error: 'Refresh token expired or invalid. Please log in again.' });
			}
		  }
	  
		  // Return error for other issues
		  return res.status(401).json({
			error: error.message === "jwt expired"
			  ? "Access token expired. Please log in again."
			  : "Unauthorized access. Invalid token.",
		  });
		}
});


const getUserId = (() => {
	return process.env.USER_ID
})

const getUserEmail = (() => {
	return process.env.USER_EMAIL
})
const getUserName = (() => {
	return process.env.USER_NAME
})


module.exports = { AuthMiddleware, getUserId, getUserEmail, getUserName };
