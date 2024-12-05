const jwt = require('jsonwebtoken');
const { getAccessToken } = require('../helper/jwtHelper'); // Ensure this function handles token generation
const { validateRefreshToken } = require('../helper/jwtHelper'); // Add a helper to validate refresh tokens

const TokenInterceptor = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken || !refreshToken) {
            return res.status(401).send({ message: 'Authentication required.' });
        }

        // Verify Access Token
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err) => {
            if (err && err.name === 'TokenExpiredError') {
                // Access token expired, validate refresh token
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, async (refreshErr, decoded) => {
                    if (refreshErr) {
                        return res.status(403).send({ message: 'Invalid or expired refresh token.' });
                    }

                    // Generate new tokens
                    const newAccessToken = getAccessToken({
                        userId: decoded.userId,
                        userEmail: decoded.userEmail,
                        username: decoded.username,
                    });

                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'Strict',
                        maxAge: 1000 * 60 * parseInt(process.env.JWT_TOKEN_EXP.replace('m', '')),
                    });

                    req.user = decoded; // Attach user info to request
                });
            } else if (err) {
                return res.status(403).send({ message: 'Invalid access token.' });
            } else {
                req.user = jwt.decode(accessToken); // Decode valid token
            }
        });

        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error.' });
    }
};

module.exports = { TokenInterceptor };
