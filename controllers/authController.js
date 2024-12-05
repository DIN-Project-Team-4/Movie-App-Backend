const {validateUser } = require('../models/authModel')

const onAuthorization = async (req, res) => {
    const { userEmail, password } = req.body;

    if (!userEmail || !password) {
        return res.status(400).send({ message: 'Email and password are required.' });
    }

    try {
        const result = await validateUser(userEmail, password);

        const cookieExp = 1000 * 60 * parseInt(process.env.JWT_TOKEN_EXP.replace("m", ""));
        const refreshCookieExp = 1000 * 60 * 60 * 24 * 14;

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict",
            maxAge: cookieExp,
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict",
            maxAge: refreshCookieExp,
        });

        delete result.accessToken;
        delete result.refreshToken;

        res.status(200).send(result);
    } catch (error) {
        res.status(error.statusCode || 500).send({ message: error.message });
    }
};
   

module.exports = {onAuthorization};