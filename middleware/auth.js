const axios = require('axios');

const jsonHttpHeaders = {
    'Content-Type': 'application/json',
};

const errorJsonResponse = (message, statusCode) => {
    return {
        statusCode,
        body: JSON.stringify({ message }),
    };
};

const authMiddleware = async (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (bearerToken) {
        try {
            const response = await axios.get(process.env.AUTH_USER_ENDPOINT, {
                headers: {
                    Authorization: bearerToken,
                    ...jsonHttpHeaders,
                },
            });

            if (response.status === 200) {
                req.user = response.data.data;
                console.log(req.user);
                next();
            } else {
                res.status(401).json({ message: 'User authorization failed' });
            }
        } catch (error) {
            res.status(401).json({ message: 'User authorization failed' });
        }
    } else {
        res.status(401).json({ message: 'Authorization header not set' });
    }
};

module.exports = authMiddleware;
