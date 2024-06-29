const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = validateToken;
