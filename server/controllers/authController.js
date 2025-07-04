const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// desc Login
// route POST /auth
// access public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    //Make sure to extend token times after testing
    const accessToken = jwt.sign(
        { 'username': foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
    )

    const refreshToken = jwt.sign(
        { 'username': foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    // create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server, not JS
        secure: false, // uses https, change to true for deployment
        sameSite: 'None', // cross-site cookie is possible
        maxAge: 1 * 24 * 60 * 60 * 1000 // cookie expiry, set to match rtoken
    })

    //send accessToken containing username
    res.json({ accessToken })
})

// desc refresh
// route GET /auth/refresh
// access public (token has expired)
const refresh = (req, res) => {
    const cookies = req.cookies
    
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username })

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                { 'username': foundUser.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' }
            )

            res.json({ accessToken })
        })
    )
}

// desc logout
// route Post /auth/logout
// access public - just to clear cookie if it exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) // no content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: false }) //change secure to true for deployment
    res.json({ message: 'Cookie cleared'})
}

module.exports = {
    login,
    refresh,
    logout
};