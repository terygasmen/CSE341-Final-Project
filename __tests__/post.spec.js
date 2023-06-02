const app = require('../routes/index');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app);

describe('Test Handlers', () => {
  test('responds to post /restaurants', async () => {
    const res = await request.post('/restaurants').send({
      name: 'Restaurant 3',
      description: 'Restaurant 3 Description',
      phone_number: '+12 345 6789',
      opening_hours: '6am - 10pm',
      average_rating: '5 stars',
      menu_id: '646f7a47f3c0b6aa6b2be7b9',
    });
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  }, 15000);

  test('responds to post /users', async () => {
    const res = await request.post('/users').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      birthday: '1990-01-01',
    });
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  }, 15000);
});
