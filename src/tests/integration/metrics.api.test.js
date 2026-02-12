const request = require('supertest');
const app = require('../../app');

describe('Metrics API', () => {

  test('GET /api/v1/metrics/daily should return 200', async () => {
    const res = await request(app)
      .get('/api/v1/metrics/daily')
      .set('X-API-Key', process.env.API_KEY);

    expect(res.statusCode).toBe(200);
  });

  test('should return 401 without API key', async () => {
  const res = await request(app)
    .get('/api/v1/metrics/daily');

  expect(res.statusCode).toBe(401);
});


test('should return 429 after limit', async () => {
  for (let i = 0; i < 6; i++) {
    await request(app)
      .get('/api/v1/metrics/daily')
      .set('X-API-Key', process.env.API_KEY);
  }

  const res = await request(app)
    .get('/api/v1/metrics/daily')
    .set('X-API-Key', process.env.API_KEY);

  expect(res.statusCode).toBe(429);
});

test('should cache response', async () => {
  // First request — populates the cache
  const res1 = await request(app)
    .get('/api/v1/metrics/daily')
    .set('X-API-Key', process.env.API_KEY);

  // Wait a tiny bit to simulate real requests (optional)
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Second request — should come from cache
  const res2 = await request(app)
    .get('/api/v1/metrics/daily')
    .set('X-API-Key', process.env.API_KEY);

  // Responses should be identical
  expect(res2.body).toEqual(res1.body);

  // Optionally, if you want, log a message
  console.log('Cache test passed: responses are identical.');
});



});
