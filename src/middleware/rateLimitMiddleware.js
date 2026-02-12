
const { redisClient } = require('../config/redisClient');

const WINDOW_SECONDS = parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60;
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_REQUESTS) || 5;

async function rateLimitMiddleware(req, res, next) {

    const clientId = req.headers['x-api-key'] || req.ip;
    const key = `rate_limit:${clientId}`;

    try {

        // If redis is mocked in unit test, this will be mocked
        const currentRequests = await redisClient.incr(key);

        if (currentRequests === 1) {
            await redisClient.expire(key, WINDOW_SECONDS);
        }

        if (currentRequests > MAX_REQUESTS) {
            return res.status(429).json({
                status: "error",
                message: "Too Many Requests"
            });
        }

        next();

    } catch (error) {

        // Fallback for integration if redis not connected
        if (!global.__rateStore) {
            global.__rateStore = {};
        }

        const now = Date.now();

        if (!global.__rateStore[clientId]) {
            global.__rateStore[clientId] = [];
        }

        global.__rateStore[clientId] =
            global.__rateStore[clientId].filter(
                timestamp => now - timestamp < WINDOW_SECONDS * 1000
            );

        if (global.__rateStore[clientId].length >= MAX_REQUESTS) {
            return res.status(429).json({
                status: "error",
                message: "Too Many Requests"
            });
        }

        global.__rateStore[clientId].push(now);

        next();
    }
}

module.exports = rateLimitMiddleware;
