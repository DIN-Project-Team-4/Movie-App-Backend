const {validateUser } = require('../models/authModel')

const onAuthorization = async (req, res) => {
    const { userEmail, password } = req.body;

    if (!userEmail || !password) {
        return res.status(400).send({ message: 'Email and password are required.' });
    }

    try {
        const result = await validateUser(userEmail, password);

        const refreshCookieExp = 1000 * 60 * 60 * 24 * 14;

        const authTokens = {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        };

        res.cookie("tokens", authTokens, {
            httpOnly: true,
            secure: false, 
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