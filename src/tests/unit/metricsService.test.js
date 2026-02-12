const metricsService = require('../../services/metricsService');

describe('Metrics Service', () => {
  test('should generate daily metrics', async () => {
    const result = await metricsService.getDailyMetrics('2024-01-01');

    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('totalUsers');
    expect(result).toHaveProperty('totalSales');
  });
});
