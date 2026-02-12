// const app = require('./app');
// const { connectRedis } = require('./config/redisClient');

// const PORT = process.env.PORT || 8080;

// async function startServer() {
//     try {
//         await connectRedis();

//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });

//     } catch (error) {
//         console.error("Failed to start server:", error);
//         process.exit(1);
//     }
// }

// startServer();
const app = require('./app');
const { connectRedis } = require('./config/redisClient');

const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        await connectRedis();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

// Only start server if not testing
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = { startServer };

