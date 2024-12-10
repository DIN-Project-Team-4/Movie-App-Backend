const jwt = require("jsonwebtoken");
const { getAccessToken } = require("../helper/jwtHelper");

const TokenInterceptor = async (req, res, next) => {
    try {
        const accessToken = req.cookies.tokens.accessToken;
        const refreshToken = req.cookies.tokens.refreshToken;
        if (!accessToken || !refreshToken) {
            return res.status(401).send({ message: "Authentication required." });
        }

        // Verify Access Token
        try {
            req.user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY); 
            //console.log("Access Token is valid:", req.user);
            return next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                //console.log("Access Token expired, verifying Refresh Token...");

                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
                    // Generate new Access Token
                    const newAccessToken = getAccessToken({
                        userId: decoded.userId,
                        userEmail: decoded.userEmail,
                        username: decoded.username,
                    });

                    // Set new Access Token in cookies
                    const authTokens = {
                        accessToken: newAccessToken,
                        refreshToken: refreshToken
                    };
                    res.cookie("tokens", tokens, {
                        httpOnly: true,
                        secure: false, 
                        sameSite: "Strict",
                        maxAge: 1000 * 60 * 60 * 24 * 14,
                    });


                    req.user = decoded; // Attach user info to request
                    //console.log("New Access Token generated and set.");
                    return next();
                } catch (refreshErr) {
                    //console.error("Refresh Token verification failed:", refreshErr.message);
                    return res.status(403).send({ message: "Invalid or expired refresh token." });
                }
            }

            //console.error("Access Token verification failed:", err.message);
            return res.status(403).send({ message: "Invalid access token." });
        }
    } catch (error) {
        console.error("Error in TokenInterceptor:", error);
        return res.status(500).send({ message: "Internal Server Error." });
    }
};

module.exports = { TokenInterceptor };
