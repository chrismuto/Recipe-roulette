const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //1 minute
    max: 5, //Limit login attemps to max per window
    message:
        { message: 'Too many login attempts from this address, please try again in 60 seconds'},
    handler: (req, res, next, options) => {
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, //return rate limit info in the 'RateLimit-* headers
    legacyHeaders: false, //Disable the 'X-RateLimit-*' headers
})

module.exports = loginLimiter;