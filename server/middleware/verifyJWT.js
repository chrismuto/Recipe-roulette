const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    //may need req.headers['authorization'] instead of req.headers.authorization
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ loggedIn: false, message: 'No token provided' });
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ loggedIn: false, message: 'Failed to authenticate token' }) //if token is not verified, return loggedIn variable of false
            req.user = decoded.username
            next()
        }
    )
}

module.exports = verifyJWT