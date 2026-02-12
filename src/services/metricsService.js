// src/services/metricsService.js

// -----------------------------
// Mock Data Storage (In-Memory)
// -----------------------------

let dailyMetrics = [];
let hourlyMetrics = [];

/**
 * Utility: Generate random number in range
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Utility: Format Date to YYYY-MM-DD
 */
function formatDate(date) {
    return date.toISOString().split("T")[0];
}

/**
 * Generate Mock Daily Data (Last 4 Months)
 */
function generateDailyMetrics() {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 4); // 4 months back

    const today = new Date();

    let currentDate = new Date(startDate);

    while (currentDate <= today) {
        dailyMetrics.push({
            date: formatDate(currentDate),
            users_active: getRandomNumber(80, 200),
            page_views: getRandomNumber(1000, 5000),
            revenue: parseFloat((Math.random() * 1000).toFixed(2))
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }
}

/**
 * Generate Mock Hourly Data (Last 30 Days)
 */
function generateHourlyMetrics() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const now = new Date();
    let currentDate = new Date(startDate);

    while (currentDate <= now) {
        hourlyMetrics.push({
            datetime: currentDate.toISOString(),
            users_active: getRandomNumber(5, 50),
            page_views: getRandomNumber(100, 500),
            revenue: parseFloat((Math.random() * 100).toFixed(2))
        });

        currentDate.setHours(currentDate.getHours() + 1);
    }
}

/**
 * Initialize mock data (called once on startup)
 */
function initializeMockData() {
    generateDailyMetrics();
    generateHourlyMetrics();
    console.log("Mock metrics data generated successfully.");
}

/**
 * Filter Daily Metrics by Date Range
 */
function getDailyMetrics(date) {

    const entry = dailyMetrics.find(entry => entry.date === date);

    if (!entry) {
        return {
            date,
            totalUsers: 0,
            totalSales: 0
        };
    }

    return {
        date: entry.date,
        totalUsers: entry.users_active,
        totalSales: entry.revenue
    };
}

/**
 * Filter Hourly Metrics by Date Range
 */
function getHourlyMetrics(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = hourlyMetrics.filter(entry => {
        const entryDate = new Date(entry.datetime);
        return entryDate >= start && entryDate <= end;
    });

    return filtered;
}

module.exports = {
    initializeMockData,
    getDailyMetrics,
    getHourlyMetrics
};
