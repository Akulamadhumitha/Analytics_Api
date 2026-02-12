// require('dotenv').config();
// const express = require('express');
// const metricsService = require('./services/metricsService');
// const metricsRoutes = require('./routes/metrics');
// const { connectRedis } = require('./config/redisClient');


// const app = express();
// // const PORT = process.env.PORT || 3000;
// const PORT = process.env.PORT || 8080;


// app.use(express.json());
// // Initialize mock data
// metricsService.initializeMockData();
// // Register routes
// app.use('/api/v1/metrics', metricsRoutes);

// // Health check route
// app.get('/health', (req, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "Analytics API is running"
//     });
// });

// async function startServer() {
//     try {
//         await connectRedis();

//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });

//     } catch (error) {
//         console.error("Failed to start server:", error);
//     }
// }

// module.exports = app;
require('dotenv').config();
const express = require('express');
const metricsService = require('./services/metricsService');
const metricsRoutes = require('./routes/metrics');

const app = express();

app.use(express.json());

// Initialize mock data
metricsService.initializeMockData();

// Register routes
app.use('/api/v1/metrics', metricsRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Analytics API is running"
    });
});

// module.exports = app;
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = app;




