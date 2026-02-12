const { redisClient } = require('../../config/redisClient');
const rateLimitMiddleware = require('../../middleware/rateLimitMiddleware');

jest.mock('../../config/redisClient');

describe('Rate Limiter Logic', () => {

  const mockReq = {
    headers: { 'x-api-key': 'test_key' },
    ip: '127.0.0.1'
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    set: jest.fn(),
    json: jest.fn()
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RATE_LIMIT_REQUESTS = '5';
    process.env.RATE_LIMIT_WINDOW_SECONDS = '60';
  });

  test('should allow request under limit', async () => {
    redisClient.incr = jest.fn().mockResolvedValue(1);
    redisClient.expire = jest.fn().mockResolvedValue(1);

    await rateLimitMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  test('should block when limit exceeded', async () => {
    redisClient.incr = jest.fn().mockResolvedValue(6); // exceed limit
    redisClient.expire = jest.fn().mockResolvedValue(1);

    await rateLimitMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(429);
  });

});
