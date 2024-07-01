const request = require('supertest');
const app = require('../../app');
const bcrypt = require('bcrypt');
const sequelize = require('../../database');
const User = require('../../models/User');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });

    const passwordHash = await bcrypt.hash('password123', 10);
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: passwordHash,
    });
  });

  it('should authenticate with valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should not authenticate with invalid email', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'invalid@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User email does not exists');
  });

  it('should not authenticate with invalid password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'invalidpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Password does not match');
  });
});