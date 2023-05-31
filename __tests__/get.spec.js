const app = require('../routes/index');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app);

describe('Test Handlers', () => {
  test('responds to /restaurants', async () => {
    const res = await request.get('/restaurants');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
  }, 15000);

  test('responds to /users', async () => {
    const res = await request.get('/users');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
  }, 15000);
});
