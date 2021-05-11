const RateLimit = require('express-rate-limit');

const min_1 = new RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5
});

module.exports = {
    min_1
}