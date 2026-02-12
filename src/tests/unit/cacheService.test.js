const cacheService = require('../../services/cacheService');
const { redisClient } = require('../../config/redisClient');

jest.mock('../../config/redisClient');

describe('Cache Service', () => {
  test('should store and retrieve cache', async () => {
    redisClient.get.mockResolvedValue(JSON.stringify({ value: 100 }));

    const data = await cacheService.get('testKey');

    expect(data).toEqual({ value: 100 });
  });
});
