const jwt = require("jsonwebtoken");
const { getAccessToken } = require("../helper/jwtHelper");

const TokenInterceptor = async (req, res, next) => {
    console.log("TokenInterceptor middleware triggered"); // Debugging middleware
    console.log("Access Token inside function:", req.cookies.accessToken); // Debugging tokens
    console.log("Refresh Token:", req.cookies.refreshToken);

    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken || !refreshToken) {
            return res.status(401).send({ message: "Authentication required." });
        }

        // Verify Access Token
        try {
            req.user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY); // Decode valid token
            console.log("Access Token is valid:", req.user);
            return next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                console.log("Access Token expired, verifying Refresh Token...");

                try {
                    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
                    console.log("Refresh Token is valid:", decoded);

                    // Generate new Access Token
                    const newAccessToken = getAccessToken({
                        userId: decoded.userId,
                        userEmail: decoded.userEmail,
                        username: decoded.username,
                    });

                    // Set new Access Token in cookies
                    res.cookie("accessToken", newAccessToken, {
                        httpOnly: true,
                        secure: false, //Changed to accept http requests, clarification: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#secure_and_httponly_cookies
                        sameSite: "Strict",
                        maxAge: 1000 * 60 * parseInt(process.env.JWT_TOKEN_EXP.replace("m", "")),
                    });

                    req.user = decoded; // Attach user info to request
                    console.log("New Access Token generated and set.");
                    return next();
                } catch (refreshErr) {
                    console.error("Refresh Token verification failed:", refreshErr.message);
                    return res.status(403).send({ message: "Invalid or expired refresh token." });
                }
            }

            console.error("Access Token verification failed:", err.message);
            return res.status(403).send({ message: "Invalid access token." });
        }
    } catch (error) {
        console.error("Error in TokenInterceptor:", error.message);
        return res.status(500).send({ message: "Internal Server Error." });
    }
};

module.exports = { TokenInterceptor };
