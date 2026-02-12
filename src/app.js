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

module.exports = app;





