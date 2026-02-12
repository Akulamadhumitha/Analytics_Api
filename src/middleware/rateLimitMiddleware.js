// const { redisClient } = require('../config/redisClient'); // adjust path if needed

// /**
//  * Distributed Rate Limiting Middleware
//  */
// async function rateLimitMiddleware(req, res, next) {
//     if (process.env.NODE_ENV === 'test') {
//     return next();
// }
//     try {
//         const windowSeconds = parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS) || 60;
//         const maxRequests = parseInt(process.env.RATE_LIMIT_REQUESTS) || 10;

//         // Identify client
//         const clientId = req.client_id || req.ip;

//         const redisKey = `rate_limit:${clientId}`;

//         // Increment request count
//         const currentRequests = await redisClient.incr(redisKey);

//         // If first request → set expiry
//         if (currentRequests === 1) {
//             await redisClient.expire(redisKey, windowSeconds);
//         }

//         // Get remaining TTL
//         const ttl = await redisClient.ttl(redisKey);

//         const remainingRequests = Math.max(maxRequests - currentRequests, 0);

//         // Set headers
//         res.setHeader("X-RateLimit-Limit", maxRequests);
//         res.setHeader("X-RateLimit-Remaining", remainingRequests);

//         // If limit exceeded
//         if (currentRequests > maxRequests) {
//             res.setHeader("Retry-After", ttl);

//             return res.status(429).json({
//                 status: "error",
//                 message: "Too Many Requests",
//                 retry_after_seconds: ttl
//             });
//         }

//         next();

//     } catch (error) {
//         console.error("Rate limiting error:", error);
//         return res.status(500).json({
//             status: "error",
//             message: "Rate limiter failure"
//         });
//     }
// }

// module.exports = rateLimitMiddleware;
// src/middleware/rateLimitMiddleware.js



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
