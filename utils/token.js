require('dotenv').config();

const jwt = require('jsonwebtoken');

let jwtsecretkey = process.env.JWT_SECRET_KEY

// creating a token
const createToken = (id) => {
    return jwt.sign({ id }, jwtsecretkey, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};

// ;ddvmkasddpk
// verifying the generated token
const validateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid token' });

        req.user = user;
        next();
    });
}

module.exports = { createToken, validateToken };




