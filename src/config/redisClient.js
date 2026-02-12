const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
    url: redisUrl
});

// Handle connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
});

async function connectRedis() {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1); // Exit app if Redis fails (production-safe choice)
    }
}

module.exports = {
    redisClient,
    connectRedis
};
