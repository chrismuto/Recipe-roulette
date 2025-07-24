const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// desc Login
// route POST /auth
// access public
const handleLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    
    const foundUser = await User.findOne({ username }).exec()
    
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });
    
    const match = await bcrypt.compare(password, foundUser.password);
    
    if (!match) return res.status(401).json({ message: 'Unauthorized' });
    
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
    
    //saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    
    // send refresh token
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, //accessible only by web server, not JS
        secure: false, // uses https, change to true for deployment
        sameSite: 'Lax', // cross-site cookie is possible
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry, set to match rtoken
    })

    //send accessToken containing username
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false, // use true in production with HTTPS
        sameSite: 'Lax', // or 'Strict'
        maxAge: 10 * 60 * 1000, // 10m
    });

    res.json({ message: 'login successful' });
})

// desc refresh
// route GET /auth/refresh
// access public (token has expired)
const handleRefresh = asyncHandler( async (req, res) => {
    const cookies = req.cookies
    
    if (!cookies?.refreshToken) return res.status(401).json({ message: 'Unauthorized' })
        
        const refreshToken = cookies.refreshToken
        
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) return res.status(403).json({ message: "forbidden" });
        
    //evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.status(403).json({ message: 'Forbidden' })

            const accessToken = jwt.sign(
                { 'username': decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' }
            )

            //send accessToken containing username
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false, // use true in production with HTTPS
                sameSite: 'Lax', // or 'Strict'
                maxAge: 10 * 60 * 1000, // 10m
            });
        }
    );
});

// desc logout
// route Post /auth/logout
// access public - just to clear cookie if it exists
const handleLogout = asyncHandler( async (req, res) => {
    // On client, delete accessToken as well
    const cookies = req.cookies
    if (!cookies?.refreshToken) return res.sendStatus(204) // no content
    const refreshToken = cookies.refreshToken;
    
    //is refreshToken in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Lax', secure: false }) //change secure to true and lax to None for deployment
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Lax', secure: false }) //change secure to true and lax to None for deployment
        res.json({ message: 'Cookie cleared'})
    }

    //delete refreshToken in DB
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result); //delete for production;

    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'Lax', secure: false }) //change secure to true and Lax to None for deployment
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Lax', secure: false }) //change secure to true and Lax to None for deployment
    res.json({ message: 'Cookie cleared'})
});

module.exports = {
    handleLogin,
    handleRefresh,
    handleLogout
};