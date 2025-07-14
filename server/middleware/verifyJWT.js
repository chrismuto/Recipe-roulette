const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    //may need req.headers['authorization'] instead of req.headers.authorization
    const authHeader = req.headers.authorization || req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ loggedIn: false }) //if authorization header does not start with 'Bearer ' return loggedIn variable of false
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ loggedIn: false }) //if token is not verified, return loggedIn variable of false
            req.user = decoded.username
            next()
        }
    )
}

module.exports = verifyJWT