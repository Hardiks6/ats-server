const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, {
        expiresIn: '30d' // expires in 86400-24 hours, 604800 =='7d' 7 days, '30d'- 30 days.   
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
};

const generateResetToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.RESET_SECRET_KEY, { expiresIn: '1h' }); // Expires in 1 hour
};

module.exports = {
    generateToken,
    verifyToken,
    generateResetToken
};
