const express = require('express');
const router = express.Router();
const metricsService = require('../services/metricsService');
const cacheService = require('../services/cacheService');
const authenticateApiKey = require('../middleware/authMiddleware');
const rateLimitMiddleware = require('../middleware/rateLimitMiddleware');

// ✅ Apply rate limiting to ALL routes in this router
router.use(authenticateApiKey);
router.use(rateLimitMiddleware);


// -----------------------------
// Validation Helpers
// -----------------------------

function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

function validateDateRange(startDate, endDate) {
    if (startDate && !isValidDateFormat(startDate)) {
        return "Invalid start_date format. Use YYYY-MM-DD.";
    }

    if (endDate && !isValidDateFormat(endDate)) {
        return "Invalid end_date format. Use YYYY-MM-DD.";
    }

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return "start_date cannot be after end_date.";
        }
    }

    return null;
}

// -----------------------------
// GET /api/v1/metrics/daily
// -----------------------------

router.get('/daily', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        const validationError = validateDateRange(start_date, end_date);
        if (validationError) {
            return res.status(400).json({
                status: "error",
                message: validationError
            });
        }

        const cacheKey = cacheService.generateCacheKey(req);

        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
            res.setHeader("X-Cache-Status", "HIT");
            return res.status(200).json(cachedData);
        }

        let data;
        if (start_date && end_date) {
            data = metricsService.getDailyMetrics(start_date, end_date);
        } else {
            data = metricsService.getDailyMetrics("1900-01-01", "2100-01-01");
        }

        const response = {
            status: "success",
            count: data.length,
            data
        };

        await cacheService.set(cacheKey, response);

        res.setHeader("X-Cache-Status", "MISS");
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

// -----------------------------
// GET /api/v1/metrics/hourly
// -----------------------------

router.get('/hourly', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        const validationError = validateDateRange(start_date, end_date);
        if (validationError) {
            return res.status(400).json({
                status: "error",
                message: validationError
            });
        }

        const cacheKey = cacheService.generateCacheKey(req);

        const cachedData = await cacheService.getFromCache(cacheKey);
        if (cachedData) {
            res.setHeader("X-Cache-Status", "HIT");
            return res.status(200).json(cachedData);
        }

        let data;
        if (start_date && end_date) {
            const start = new Date(start_date);
            const end = new Date(end_date);
            end.setHours(23, 59, 59, 999);
            data = metricsService.getHourlyMetrics(start, end);
        } else {
            data = metricsService.getHourlyMetrics("1900-01-01", "2100-01-01");
        }

        const response = {
            status: "success",
            count: data.length,
            data
        };

        await cacheService.set(cacheKey, response);

        res.setHeader("X-Cache-Status", "MISS");
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

// -----------------------------
// POST /api/v1/metrics/cache/invalidate
// -----------------------------

router.post('/cache/invalidate', authenticateApiKey, async (req, res) => {
    try {
        await cacheService.clearCache();

        return res.status(200).json({
            status: "success",
            message: "Cache invalidated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to invalidate cache"
        });
    }
});

module.exports = router;
