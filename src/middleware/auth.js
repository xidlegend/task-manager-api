const jwt = require('jsonwebtoken');
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        // verify token signature
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user by id and verify token
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error('Authentication Invalid / Timed Out');
        }

        req.token = token;
        req.user = user;

        next();

    } catch (err) {
        // LOGIN-CASE
        if (req.path === '/users/login') {
            return next();
        }
        // GENERAL ERROR
        res.status(401).send('Error: Please Authenticate')
    }
}


module.exports = auth;