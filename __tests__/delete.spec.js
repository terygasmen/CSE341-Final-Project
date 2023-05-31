const request = require('supertest');
const app = require('../routes/index');

describe('DELETE /restaurants/:id', () => {
  it('should delete a restaurant by ID', async () => {
    const response = await request(app)
      .delete('/restaurants/6476d5a3704e47faec3f5c2e')
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Restaurant deleted successfully' });
  });
});

describe('DELETE /menu/:id', () => {
  it('should delete a menu by ID', async () => {
    const response = await request(app)
      .delete('/menu/646f7a47f3c0b6aa6b2be7b9')
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Menu deleted successfully' });
  });
});

describe('DELETE /users/:id', () => {
  it('should delete a user by ID', async () => {
    const response = await request(app)
      .delete('/users/6476e292a9303d376f463c93')
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted successfully' });
  });
});

describe('DELETE /items/:id', () => {
  it('should delete an item by ID', async () => {
    const response = await request(app)
      .delete('/items/6476e56f02ed0345a7e07415')
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Item deleted successfully' });
  });
});

describe('DELETE /orders/:id', () => {
  it('should delete an order by ID', async () => {
    const response = await request(app)
      .delete('/orders/6476e7516c836394de90057f')
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Order deleted successfully' });
  });
});
