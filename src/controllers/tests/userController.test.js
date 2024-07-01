const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../database');
const User = require('../../models/User');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Controller', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  it('should create a new user with valid data', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test User');
    expect(response.body.email).toBe('test@example.com');
  });

  it('should not create a new user with an existing email', async () => {
    await User.create({
      name: 'Existing User',
      email: 'test@example.com',
      password: 'password123',
    });

    const response = await request(app)
      .post('/user')
      .send({
        name: 'New User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User email already exists');
  });
});
