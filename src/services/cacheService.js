// const { redisClient } = require('../config/redisClient');

// const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS) || 300;

// /**
//  * Generate deterministic cache key
//  */
// function generateCacheKey(req) {
//     const baseKey = req.originalUrl; 
//     return `metrics_cache:${baseKey}`;
// }

// /**
//  * Get data from cache
//  */
// async function getFromCache(key) {
//     try {
//         const data = await redisClient.get(key);
//         return data ? JSON.parse(data) : null;
//     } catch (error) {
//         console.error("Cache GET Error:", error);
//         return null;
//     }
// }

// /**
//  * Store data in cache
//  */
// async function setToCache(key, value) {
//     try {
//         await redisClient.setEx(
//             key,
//             CACHE_TTL,
//             JSON.stringify(value)
//         );
//     } catch (error) {
//         console.error("Cache SET Error:", error);
//     }
// }

// /**
//  * Clear all cache
//  */
// async function clearCache() {
//     try {
//         await redisClient.flushDb();
//         console.log("Cache cleared successfully.");
//     } catch (error) {
//         console.error("Cache clear error:", error);
//     }
// }

// module.exports = {
//     generateCacheKey,
//     getFromCache,
//     setToCache,
//     clearCache
// };

// src/services/cacheService.js


const { redisClient } = require('../config/redisClient');

const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS) || 300;

// In-memory fallback store
const memoryCache = {};

function generateCacheKey(req) {
    return `metrics_cache:${req.originalUrl}`;
}

async function get(key) {
    try {
        const data = await redisClient.get(key);
        if (data) return JSON.parse(data);
    } catch (error) {
        // fallback to memory
    }

    return memoryCache[key] || null;
}

async function set(key, value) {
    try {
        await redisClient.setEx(
            key,
            CACHE_TTL,
            JSON.stringify(value)
        );
    } catch (error) {
        // fallback to memory
    }

    memoryCache[key] = value;
}

async function clearCache() {
    try {
        await redisClient.flushDb();
    } catch (error) {
        // ignore
    }

    for (const key in memoryCache) {
        delete memoryCache[key];
    }
}

module.exports = {
    generateCacheKey,
    get,
    set,
    clearCache
};
