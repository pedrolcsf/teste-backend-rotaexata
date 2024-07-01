const request = require('supertest');
const app = require('../../app');
const sequelize = require('../../database');
const Address = require('../../models/Address');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const getToken = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);

  user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: passwordHash,
  });

  const response = await request(app)
    .post('/login')
    .send({
      email: 'test@example.com',
      password: 'password123',
  });

  return response.body.token;
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Address Controller', () => {
  let authToken;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    authToken = await getToken()
  });


  it('should create a new address with valid data', async () => {
    const response = await request(app)
      .post('/addresses')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        zipcode: '0000000',
        street: 'Test Street',
        district: 'Test District',
        city: 'Test City',
        state: 'ST',
        complement: 'Apt 1',
        number: 123,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.zipcode).toBe('12345678');
  });
});

