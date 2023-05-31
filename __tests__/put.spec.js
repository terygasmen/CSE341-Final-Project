const app = require('../routes/index');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const request = supertest(app);

describe('PUT /restaurants/:id', () => {
  it('should update a restaurant by ID', async () => {
    const response = await request(app)
      .put('/restaurants/6476d5a3704e47faec3f5c2e')
      .send({
        name: 'Restaurant 4',
        description: 'Restaurant 4 Description',
        phone_number: '+12 345 6789',
        opening_hours: '6am - 10pm',
        average_rating: '3 stars',
        menu_id: '646f79d0f3c0b6aa6b2be7b7'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Restaurant updated successfully' });
  });
});

describe('PUT /menu/:id', () => {
  it('should update a menu by ID', async () => {
    const response = await request(app)
      .put('/menu/646f7a47f3c0b6aa6b2be7b9')
      .send({
        name: 'Breakfast Menu 3',
        description: 'Breakfast Menu 3 Description',
        restaurant_id: '646f79d0f3c0b6aa6b2be7b7'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Menu updated successfully' });
  });
});

describe('PUT /users/:id', () => {
  it('should update a user by ID', async () => {
    const response = await request(app)
      .put('/users/6476e292a9303d376f463c93')
      .send({
        firstName: 'Betty',
        lastName: 'Doe',
        email: 'bettydoe@example.com',
        birthday: '1990-01-01'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'User updated successfully' });
  });
});

describe('PUT /items/:id', () => {
  it('should update an item by ID', async () => {
    const response = await request(app)
      .put('/items/6476e56f02ed0345a7e07415')
      .send({
        name: 'Item 2',
        description: 'Item 2 Description',
        price: '$1',
        menu_id: '646f7a47f3c0b6aa6b2be7b9'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Item updated successfully' });
  });
});

describe('PUT /orders/:id', () => {
  it('should update an order by ID', async () => {
    const response = await request(app)
      .put('/orders/6476e7516c836394de90057f')
      .send({
        restaurant_id: '646f79d0f3c0b6aa6b2be7b7',
        customer_name: 'Customer 3',
        customer_email: 'customer3@email.test',
        total_amount: '$1',
        date_and_time_of_order: '2023-05-27 01:39am',
        status: 'Finished'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Order updated successfully' });
  });
});
