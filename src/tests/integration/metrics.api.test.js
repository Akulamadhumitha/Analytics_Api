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
  const start1 = Date.now();

  await request(app)
    .get('/api/v1/metrics/daily')
    .set('X-API-Key', process.env.API_KEY);

  const time1 = Date.now() - start1;

  const start2 = Date.now();

  await request(app)
    .get('/api/v1/metrics/daily')
    .set('X-API-Key', process.env.API_KEY);

  const time2 = Date.now() - start2;

  expect(time2).toBeLessThan(time1);
});


});
